(function () {
  const profilesKey = "quizLocalProfiles";
  const currentEmailKey = "quizCurrentEmail";
  const iterations = 210000;

  function readProfiles() {
    const saved = localStorage.getItem(profilesKey);
    if (!saved) return [];
    const profiles = JSON.parse(saved);
    if (!Array.isArray(profiles)) throw new Error("Device profile data is invalid.");
    return profiles;
  }

  async function hashPassword(password, salt) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("Secure local profiles require HTTPS or localhost.");
    }
    const material = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits({
      name: "PBKDF2",
      salt: Uint8Array.from(atob(salt), character => character.charCodeAt(0)),
      iterations,
      hash: "SHA-256"
    }, material, 256);
    return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, "0")).join("");
  }

  function createSalt() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return btoa(String.fromCharCode(...bytes));
  }

  function saveProfiles(profiles) {
    localStorage.setItem(profilesKey, JSON.stringify(profiles));
  }

  function publicProfile(profile) {
    return {
      name: profile.name,
      email: profile.email,
      completedLevel: profile.completedLevel,
      totalScore: profile.totalScore,
      bestMemoryScore: profile.bestMemoryScore || 0
    };
  }

  async function createProfile(details) {
    if (!details || typeof details.name !== "string" || typeof details.email !== "string" ||
        typeof details.password !== "string") {
      throw new Error("Enter a valid name, email, and password.");
    }
    const name = details.name.trim();
    const email = details.email.trim().toLowerCase();
    const password = details.password;
    if (!name || name.length > 60 || email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        password.length < 8 || password.length > 128) {
      throw new Error("Enter a name, valid email, and password of 8-128 characters.");
    }
    const profiles = readProfiles();
    if (profiles.some(profile => profile.email === email)) {
      throw new Error("An account with this email already exists on this device. Log in instead.");
    }
    const salt = createSalt();
    const profile = {
      name,
      email,
      salt,
      passwordHash: await hashPassword(password, salt),
      completedLevel: 1,
      totalScore: 0,
      bestMemoryScore: 0
    };
    profiles.push(profile);
    saveProfiles(profiles);
    localStorage.setItem(currentEmailKey, email);
    localStorage.setItem("userEmail", email);
    return publicProfile(profile);
  }

  async function login(email, password) {
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Enter your profile email and password.");
    }
    const normalizedEmail = email.trim().toLowerCase();
    const profile = readProfiles().find(item => item.email === normalizedEmail);
    if (!profile || await hashPassword(password, profile.salt) !== profile.passwordHash) {
      throw new Error("No matching profile was found on this device. Check your details or create a new profile.");
    }
    localStorage.setItem(currentEmailKey, normalizedEmail);
    localStorage.setItem("userEmail", normalizedEmail);
    return publicProfile(profile);
  }

  function getCurrentProfile() {
    const email = localStorage.getItem(currentEmailKey);
    if (!email) return null;
    const profile = readProfiles().find(item => item.email === email);
    if (!profile) {
      localStorage.removeItem(currentEmailKey);
      localStorage.removeItem("userEmail");
      return null;
    }
    return publicProfile(profile);
  }

  function updateProgress(completedLevel, score) {
    if (!Number.isInteger(completedLevel) || completedLevel < 1 || completedLevel > 100 ||
        !Number.isInteger(score) || score < 30 || score > 50 || score % 10 !== 0) {
      throw new Error("This level result is not valid.");
    }
    const email = localStorage.getItem(currentEmailKey);
    const profiles = readProfiles();
    const profile = profiles.find(item => item.email === email);
    if (!profile) throw new Error("Your local profile could not be found.");
    if (completedLevel === profile.completedLevel && completedLevel <= 100) {
      profile.completedLevel++;
      profile.totalScore += score;
      saveProfiles(profiles);
    }
    return publicProfile(profile);
  }

  function saveMemoryScore(score) {
    const email = localStorage.getItem(currentEmailKey);
    const profiles = readProfiles();
    const profile = profiles.find(item => item.email === email);
    if (!profile) throw new Error("Your local profile could not be found.");
    profile.bestMemoryScore = Math.max(profile.bestMemoryScore || 0, score);
    saveProfiles(profiles);
    return profile.bestMemoryScore;
  }

  function clearProfile(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const profiles = readProfiles();
    const remaining = profiles.filter(profile => profile.email !== normalizedEmail);
    if (remaining.length === profiles.length) return false;
    saveProfiles(remaining);
    localStorage.removeItem(`arenaBuddyMessages:${normalizedEmail}`);
    if (localStorage.getItem(currentEmailKey) === normalizedEmail) {
      localStorage.removeItem(currentEmailKey);
      localStorage.removeItem("userEmail");
    }
    return true;
  }

  function logout() {
    localStorage.removeItem(currentEmailKey);
    localStorage.removeItem("userEmail");
  }

  window.LocalProfile = {
    create: createProfile,
    login,
    getCurrent: getCurrentProfile,
    updateProgress,
    saveMemoryScore,
    clear: clearProfile,
    logout
  };
})();
