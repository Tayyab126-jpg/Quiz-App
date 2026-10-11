(function () {
  const token = localStorage.getItem("authToken");
  if (!token || typeof window.io !== "function") return;

  const socket = window.io({
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity
  });
  window.realtimeSocket = socket;

  const toast = document.createElement("div");
  toast.className = "realtime-toast unity-panel";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.hidden = true;
  document.body.appendChild(toast);

  const callOverlay = document.createElement("div");
  callOverlay.className = "call-overlay";
  callOverlay.hidden = true;
  callOverlay.innerHTML = `
    <section class="call-panel unity-panel" role="dialog" aria-modal="true" aria-labelledby="callTitle">
      <div class="call-avatar"><i class="fa-solid fa-phone"></i></div>
      <h2 id="callTitle">Voice call</h2>
      <p id="callStatus" role="status">Connecting...</p>
      <audio id="remoteCallAudio" autoplay playsinline></audio>
      <div class="call-actions">
        <button type="button" id="acceptCallBtn" class="unity-btn call-accept"><i class="fa-solid fa-phone"></i> Answer</button>
        <button type="button" id="muteCallBtn" class="unity-btn call-muted" hidden><i class="fa-solid fa-microphone-slash"></i> Mute</button>
        <button type="button" id="endCallBtn" class="unity-btn call-end"><i class="fa-solid fa-phone-slash"></i> Decline</button>
      </div>
    </section>`;
  document.body.appendChild(callOverlay);

  const callTitle = callOverlay.querySelector("#callTitle");
  const callStatus = callOverlay.querySelector("#callStatus");
  const remoteAudio = callOverlay.querySelector("#remoteCallAudio");
  const ringtone = new Audio("/ringtone.mp4");
  ringtone.loop = true;
  ringtone.preload = "auto";
  const acceptButton = callOverlay.querySelector("#acceptCallBtn");
  const muteButton = callOverlay.querySelector("#muteCallBtn");
  const endButton = callOverlay.querySelector("#endCallBtn");
  const userEmail = (localStorage.getItem("userEmail") || "").trim().toLowerCase();
  let activeCall = null;
  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 5000);
  }

  function stopRinging() {
    ringtone.pause();
    ringtone.currentTime = 0;
  }

  function startRinging() {
    stopRinging();
    ringtone.play().catch(() => {
      showToast("Your browser blocked call audio. Check sound settings or answer the call.");
    });
  }

  function notify(title, body, tag) {
    if (document.visibilityState === "visible" || !("Notification" in window) ||
        Notification.permission !== "granted") return;
    try {
      const notification = new Notification(title, { body, tag });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error("Could not show a browser notification:", error);
    }
  }

  window.enableAppNotifications = async function () {
    if (!("Notification" in window)) {
      showToast("This browser does not support notifications.");
      return "unsupported";
    }
    if (Notification.permission === "granted") {
      showToast("Notifications are already enabled.");
      return "granted";
    }
    if (Notification.permission === "denied") {
      showToast("Notifications are blocked in browser settings.");
      return "denied";
    }
    try {
      const permission = await Notification.requestPermission();
      showToast(permission === "granted" ? "Notifications enabled." : "Notification permission was not granted.");
      return permission;
    } catch (error) {
      showToast("Could not request browser notification permission.");
      return "denied";
    }
  };

  function updateOnlineList(emails) {
    const onlineEmails = Array.isArray(emails) ? emails : [];
    document.body.dataset.onlinePlayers = JSON.stringify(onlineEmails);
    window.dispatchEvent(new CustomEvent("app-presence-update", { detail: onlineEmails }));
  }

  socket.on("online_users", updateOnlineList);
  socket.on("presence_update", update => {
    if (!update || typeof update.email !== "string") return;
    let currentOnline = [];
    try {
      currentOnline = JSON.parse(document.body.dataset.onlinePlayers || "[]");
    } catch (error) {
      console.error("Could not read current online-player state:", error);
    }
    const onlineEmails = new Set(currentOnline);
    if (update.online) onlineEmails.add(update.email);
    else onlineEmails.delete(update.email);
    const list = [...onlineEmails];
    document.body.dataset.onlinePlayers = JSON.stringify(list);
    updateOnlineList(list);
  });

  socket.on("message:notification", message => {
    if (!message || message.senderEmail === userEmail) return;
    const currentPartner = new URLSearchParams(window.location.search).get("email");
    const viewingConversation = window.location.pathname.endsWith("/chat.html") &&
      currentPartner && currentPartner.toLowerCase() === message.senderEmail.toLowerCase() &&
      document.visibilityState === "visible";
    if (viewingConversation) return;
    const senderName = typeof message.senderName === "string" ? message.senderName : "A player";
    const preview = typeof message.preview === "string" ? message.preview : "Sent you a message";
    showToast(`${senderName}: ${preview}`);
    notify(`Message from ${senderName}`, preview, `message-${message.senderEmail}`);
  });

  socket.on("connect_error", () => showToast("Real-time connection lost. Reconnecting..."));

  function setCallStatus(text) {
    callStatus.textContent = text;
  }

  function showCall(name, status, incoming) {
    callTitle.textContent = `Call with ${name}`;
    setCallStatus(status);
    callOverlay.hidden = false;
    acceptButton.hidden = !incoming;
    muteButton.hidden = !activeCall || !activeCall.accepted;
    endButton.textContent = incoming ? "Decline" : activeCall && activeCall.accepted ? "End call" : "Cancel";
    endButton.innerHTML = `<i class="fa-solid fa-phone-slash"></i> ${incoming ? "Decline" : activeCall && activeCall.accepted ? "End call" : "Cancel"}`;
  }

  async function ensurePeerConnection() {
    if (!activeCall) throw new Error("Call has ended.");
    if (activeCall.peerConnection) return activeCall.peerConnection;
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
      throw new Error("Voice calls need microphone access over HTTPS or localhost.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (!activeCall) {
      stream.getTracks().forEach(track => track.stop());
      throw new Error("Call has ended.");
    }
    activeCall.localStream = stream;
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    activeCall.peerConnection = peerConnection;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    peerConnection.onicecandidate = event => {
      if (event.candidate && activeCall) {
        socket.emit("call:signal", {
          callId: activeCall.callId,
          signal: { candidate: event.candidate.toJSON() }
        });
      }
    };
    peerConnection.ontrack = event => {
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play().catch(() => setCallStatus("Call connected. Tap play on the audio if needed."));
      setCallStatus(`In call with ${activeCall.name}`);
    };
    peerConnection.onconnectionstatechange = () => {
      if (!activeCall || activeCall.peerConnection !== peerConnection) return;
      if (peerConnection.connectionState === "connected") setCallStatus(`In call with ${activeCall.name}`);
      if (peerConnection.connectionState === "failed") {
        setCallStatus("Could not establish the audio connection. Ending call.");
        socket.emit("call:end", { callId: activeCall.callId });
        clearActiveCall();
      }
    };
    return peerConnection;
  }

  async function beginOffer() {
    const peerConnection = await ensurePeerConnection();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("call:signal", {
      callId: activeCall.callId,
      signal: peerConnection.localDescription.toJSON()
    });
    setCallStatus(`Calling ${activeCall.name}...`);
  }

  async function acceptCall() {
    if (!activeCall || activeCall.role !== "callee") return;
    stopRinging();
    acceptButton.disabled = true;
    try {
      await ensurePeerConnection();
      socket.emit("call:accept", { callId: activeCall.callId }, result => {
        if (!result || !result.success) {
          showToast(result && result.message || "Could not answer the call.");
          clearActiveCall();
          return;
        }
        activeCall.accepted = true;
        showCall(activeCall.name, "Connecting...", false);
        muteButton.hidden = false;
      });
    } catch (error) {
      showToast(error.message || "Could not access the microphone.");
      socket.emit("call:reject", { callId: activeCall.callId });
      clearActiveCall();
    } finally {
      acceptButton.disabled = false;
    }
  }

  function clearActiveCall() {
    stopRinging();
    if (activeCall) {
      if (activeCall.peerConnection) {
        activeCall.peerConnection.ontrack = null;
        activeCall.peerConnection.onicecandidate = null;
        activeCall.peerConnection.close();
      }
      if (activeCall.localStream) activeCall.localStream.getTracks().forEach(track => track.stop());
    }
    remoteAudio.srcObject = null;
    muteButton.hidden = true;
    acceptButton.hidden = true;
    activeCall = null;
    callOverlay.hidden = true;
  }

  window.startVoiceCall = function (receiverEmail, receiverName) {
    if (activeCall) {
      showToast("Finish the current call before starting another one.");
      return;
    }
    if (!socket.connected) {
      showToast("Connecting to call service. Please try again in a moment.");
      return;
    }
    startRinging();
    socket.emit("call:start", { receiverEmail }, result => {
      if (!result || !result.success) {
        stopRinging();
        showToast(result && result.message || "Could not start the call.");
        return;
      }
      activeCall = {
        callId: result.callId,
        role: "caller",
        name: result.receiverName || receiverName || "Player",
        accepted: false
      };
      showCall(activeCall.name, "Ringing...", false);
    });
  };

  window.endVoiceCall = function () {
    if (!activeCall) return;
    if (activeCall.role === "callee" && !activeCall.accepted) {
      socket.emit("call:reject", { callId: activeCall.callId });
    } else {
      socket.emit("call:end", { callId: activeCall.callId });
    }
    clearActiveCall();
  };

  muteButton.addEventListener("click", () => {
    if (!activeCall || !activeCall.localStream) return;
    const track = activeCall.localStream.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    muteButton.innerHTML = track.enabled
      ? '<i class="fa-solid fa-microphone-slash"></i> Mute'
      : '<i class="fa-solid fa-microphone"></i> Unmute';
  });
  acceptButton.addEventListener("click", acceptCall);
  endButton.addEventListener("click", window.endVoiceCall);

  socket.on("call:incoming", call => {
    if (!call || activeCall) {
      if (call && call.callId) socket.emit("call:reject", { callId: call.callId });
      return;
    }
    activeCall = { callId: call.callId, role: "callee", name: call.callerName || "Player", accepted: false };
    showCall(activeCall.name, "Incoming voice call", true);
    startRinging();
    showToast(`${activeCall.name} is calling you.`);
    notify("Incoming game call", `${activeCall.name} is calling you.`, `call-${call.callId}`);
  });

  socket.on("call:outgoing", call => {
    if (!call || activeCall) return;
    activeCall = { callId: call.callId, role: "caller", name: call.receiverName || "Player", accepted: false };
    showCall(activeCall.name, "Ringing...", false);
  });

  socket.on("call:accepted", async call => {
    if (!activeCall || activeCall.callId !== call.callId || activeCall.role !== "caller") return;
    stopRinging();
    activeCall.accepted = true;
    showCall(activeCall.name, "Connecting...", false);
    try {
      await beginOffer();
      muteButton.hidden = false;
    } catch (error) {
      showToast(error.message || "Could not start the audio connection.");
      window.endVoiceCall();
    }
  });

  socket.on("call:signal", async packet => {
    if (!activeCall || packet.callId !== activeCall.callId || !activeCall.peerConnection) return;
    try {
      const peerConnection = activeCall.peerConnection;
      if (packet.signal.type === "offer") {
        await peerConnection.setRemoteDescription(packet.signal);
        await flushPendingCandidates();
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("call:signal", {
          callId: activeCall.callId,
          signal: peerConnection.localDescription.toJSON()
        });
      } else if (packet.signal.type === "answer") {
        await peerConnection.setRemoteDescription(packet.signal);
        await flushPendingCandidates();
      } else if (packet.signal.candidate) {
        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(packet.signal.candidate);
        } else {
          activeCall.pendingCandidates = activeCall.pendingCandidates || [];
          activeCall.pendingCandidates.push(packet.signal.candidate);
        }
      }
    } catch (error) {
      showToast("Could not establish the call. Please try again.");
      window.endVoiceCall();
    }
  });

  async function flushPendingCandidates() {
    if (!activeCall || !activeCall.peerConnection || !activeCall.peerConnection.remoteDescription) return;
    const candidates = activeCall.pendingCandidates || [];
    activeCall.pendingCandidates = [];
    for (const candidate of candidates) {
      await activeCall.peerConnection.addIceCandidate(candidate);
    }
  }

  socket.on("call:ended", update => {
    if (!activeCall || activeCall.callId !== update.callId) return;
    const notices = {
      rejected: "The player declined the call.",
      timeout: "The call was not answered.",
      disconnected: "The other player disconnected.",
      ended: "Call ended."
    };
    const message = notices[update.reason] || "Call ended.";
    clearActiveCall();
    showToast(message);
  });
})();
