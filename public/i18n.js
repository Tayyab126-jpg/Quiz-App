(function () {
  const translations = {
    en: {
      howItWorks: "How it works", login: "Log in", getStarted: "Get started",
      learnByPlaying: "LEARN BY PLAYING", heroTitle: "Small questions.<br><span>Big brain energy.</span>",
      heroDescription: "Take a quick quiz, build a streak, and unlock harder levels as you learn. Start easy and make every answer count.",
      startPlaying: "Start playing", seeHowItWorks: "See how it works",
      fiveQuestions: "5 questions per level · Progress that saves", yourNextChallenge: "YOUR NEXT CHALLENGE",
      levelOneEasy: "LEVEL ONE · EASY", fiveQuickQuestions: "5 quick questions",
      keepYourStreak: "Keep your streak", progressSaved: "Progress saved",
      startEasy: "Start easy", startEasyBody: "Your first level is beginner-friendly. Learn at your own pace.",
      levelUp: "Level up", levelUpBody: "Pass a level to unlock the next challenge and harder questions.",
      playTogether: "Play together", playTogetherBody: "Compare scores, chat with players, and climb the leaderboard.",
      privacy: "Privacy", home: "Home", leaderboard: "My Progress", chat: "Chat", themes: "Themes",
      levelProgression: "Level Progression (1 - 100)", syncingProgress: "Syncing server status...",
      selectCategory: "Select Category", chooseTopic: "Choose a topic for this level", cancel: "Cancel",
      highestUnlocked: "Highest unlocked: Level {level}", difficulty: "Difficulty: {difficulty}",
      questionProgress: "Question {current} of {total}", score: "Score: {score}",
      correct: "Correct", status: "Status", passed: "PASSED", tryAgain: "Try Again",
      levelCompleted: "Level Completed!", levelFailed: "Level Failed",
      greatPerformance: "Awesome performance!", needThreeCorrect: "Need 3 correct answers to unlock next level.",
      nextLevel: "Next Level", backToLevels: "Back to Level Selector", exitQuiz: "Exit Quiz Arena",
      play: "Play", easy: "Easy", medium: "Medium", hard: "Hard",
      levels: "Levels", computers: "Computers & Tech", science: "Science & Nature",
      history: "History", generalKnowledge: "General Knowledge", geography: "Geography",
      notifications: "Enable notifications", enterLevels: "Enter Level Selector",
      arenaTitle: "Quiz Progression Arena", arenaDescription: "Your progress stays on this device. Play quizzes and fun mini-games offline."
    },
    ur: {
      howItWorks: "طریقہ کار", login: "لاگ ان", getStarted: "شروع کریں",
      learnByPlaying: "کھیلتے ہوئے سیکھیں", heroTitle: "چھوٹے سوال۔<br><span>بڑی ذہانت۔</span>",
      heroDescription: "فوری کوئز کھیلیں، مسلسل کامیابی حاصل کریں، اور سیکھتے ہوئے مشکل لیول کھولیں۔ آسان سے شروع کریں اور ہر جواب کو اہم بنائیں۔",
      startPlaying: "کھیلنا شروع کریں", seeHowItWorks: "طریقہ دیکھیں",
      fiveQuestions: "ہر لیول میں 5 سوال · محفوظ پیش رفت", yourNextChallenge: "آپ کا اگلا چیلنج",
      levelOneEasy: "لیول ایک · آسان", fiveQuickQuestions: "5 فوری سوال",
      keepYourStreak: "اپنی کامیابی جاری رکھیں", progressSaved: "پیش رفت محفوظ",
      startEasy: "آسان آغاز", startEasyBody: "پہلا لیول نئے کھلاڑیوں کے لیے آسان ہے۔ اپنی رفتار سے سیکھیں۔",
      levelUp: "اگلا لیول", levelUpBody: "اگلا چیلنج اور مشکل سوال کھولنے کے لیے لیول مکمل کریں۔",
      playTogether: "ساتھ کھیلیں", playTogetherBody: "اسکور کا موازنہ کریں، بات کریں اور لیڈر بورڈ میں آگے بڑھیں۔",
      privacy: "رازداری", home: "گھر", leaderboard: "میری پیش رفت", chat: "چیٹ", themes: "تھیمز",
      levelProgression: "لیولز (1 - 100)", syncingProgress: "سرور سے پیش رفت حاصل ہو رہی ہے...",
      selectCategory: "موضوع منتخب کریں", chooseTopic: "اس لیول کے لیے موضوع منتخب کریں", cancel: "منسوخ",
      highestUnlocked: "سب سے اونچا کھلا لیول: {level}", difficulty: "مشکل: {difficulty}",
      questionProgress: "سوال {current} از {total}", score: "اسکور: {score}",
      correct: "درست", status: "حیثیت", passed: "کامیاب", tryAgain: "دوبارہ کوشش کریں",
      levelCompleted: "لیول مکمل!", levelFailed: "لیول ناکام",
      greatPerformance: "شاندار کارکردگی!", needThreeCorrect: "اگلا لیول کھولنے کے لیے 3 درست جواب ضروری ہیں۔",
      nextLevel: "اگلا لیول", backToLevels: "لیولز پر واپس جائیں", exitQuiz: "کوئز سے باہر نکلیں",
      play: "کھیلیں", easy: "آسان", medium: "درمیانہ", hard: "مشکل",
      levels: "لیولز", computers: "کمپیوٹر اور ٹیکنالوجی", science: "سائنس اور فطرت",
      history: "تاریخ", generalKnowledge: "عمومی معلومات", geography: "جغرافیہ",
      notifications: "اطلاعات فعال کریں", enterLevels: "لیول منتخب کریں",
      arenaTitle: "کوئز میدان", arenaDescription: "آپ کی پیش رفت اسی ڈیوائس پر محفوظ ہے۔ کوئز اور دلچسپ کھیل آف لائن کھیلیں۔"
    },
    es: {
      howItWorks: "Cómo funciona", login: "Iniciar sesión", getStarted: "Comenzar",
      learnByPlaying: "APRENDE JUGANDO", heroTitle: "Preguntas pequeñas.<br><span>Grandes ideas.</span>",
      heroDescription: "Resuelve un quiz rápido, mantén tu racha y desbloquea niveles más difíciles mientras aprendes. Empieza fácil y aprovecha cada respuesta.",
      startPlaying: "Empezar a jugar", seeHowItWorks: "Cómo funciona",
      fiveQuestions: "5 preguntas por nivel · Progreso guardado", yourNextChallenge: "TU PRÓXIMO RETO",
      levelOneEasy: "NIVEL UNO · FÁCIL", fiveQuickQuestions: "5 preguntas rápidas",
      keepYourStreak: "Mantén tu racha", progressSaved: "Progreso guardado",
      startEasy: "Empieza fácil", startEasyBody: "Tu primer nivel es ideal para principiantes. Aprende a tu ritmo.",
      levelUp: "Sube de nivel", levelUpBody: "Supera un nivel para desbloquear el siguiente reto y preguntas más difíciles.",
      playTogether: "Juega en compañía", playTogetherBody: "Compara puntuaciones, conversa y escala la clasificación.",
      privacy: "Privacidad", home: "Inicio", leaderboard: "Mi progreso", chat: "Chat", themes: "Temas",
      levelProgression: "Progreso de niveles (1 - 100)", syncingProgress: "Sincronizando progreso...",
      selectCategory: "Elige una categoría", chooseTopic: "Elige un tema para este nivel", cancel: "Cancelar",
      highestUnlocked: "Nivel más alto desbloqueado: {level}", difficulty: "Dificultad: {difficulty}",
      questionProgress: "Pregunta {current} de {total}", score: "Puntuación: {score}",
      correct: "Correctas", status: "Estado", passed: "SUPERADO", tryAgain: "Intentar de nuevo",
      levelCompleted: "¡Nivel completado!", levelFailed: "Nivel no superado",
      greatPerformance: "¡Muy buen trabajo!", needThreeCorrect: "Necesitas 3 respuestas correctas para desbloquear el siguiente nivel.",
      nextLevel: "Siguiente nivel", backToLevels: "Volver a los niveles", exitQuiz: "Salir del quiz",
      play: "Jugar", easy: "Fácil", medium: "Media", hard: "Difícil",
      levels: "Niveles", computers: "Informática y tecnología", science: "Ciencia y naturaleza",
      history: "Historia", generalKnowledge: "Cultura general", geography: "Geografía",
      notifications: "Activar notificaciones", enterLevels: "Ver niveles",
      arenaTitle: "Arena de Quiz", arenaDescription: "Tu progreso se guarda en este dispositivo. Juega quizzes y minijuegos sin conexión."
    },
    ar: {
      howItWorks: "كيف تعمل", login: "تسجيل الدخول", getStarted: "ابدأ الآن",
      learnByPlaying: "تعلّم باللعب", heroTitle: "أسئلة بسيطة.<br><span>عقل أكثر ذكاءً.</span>",
      heroDescription: "أجب عن اختبار سريع، وحافظ على إنجازاتك، وافتح مستويات أصعب كلما تعلمت. ابدأ بسهولة واجعل كل إجابة مهمة.",
      startPlaying: "ابدأ اللعب", seeHowItWorks: "اكتشف الطريقة",
      fiveQuestions: "٥ أسئلة في كل مستوى · تقدم محفوظ", yourNextChallenge: "تحديك القادم",
      levelOneEasy: "المستوى الأول · سهل", fiveQuickQuestions: "٥ أسئلة سريعة",
      keepYourStreak: "حافظ على إنجازك", progressSaved: "تم حفظ التقدم",
      startEasy: "ابدأ بسهولة", startEasyBody: "مستواك الأول مناسب للمبتدئين. تعلّم بالسرعة التي تناسبك.",
      levelUp: "ارتقِ بمستواك", levelUpBody: "أكمل المستوى لفتح التحدي التالي والأسئلة الأصعب.",
      playTogether: "العب مع الآخرين", playTogetherBody: "قارن النتائج وتحدث مع اللاعبين وتقدم في لوحة الصدارة.",
      privacy: "الخصوصية", home: "الرئيسية", leaderboard: "تقدمي", chat: "المحادثة", themes: "المظاهر",
      levelProgression: "تقدم المستويات (1 - 100)", syncingProgress: "جارٍ مزامنة التقدم...",
      selectCategory: "اختر فئة", chooseTopic: "اختر موضوعًا لهذا المستوى", cancel: "إلغاء",
      highestUnlocked: "أعلى مستوى مفتوح: {level}", difficulty: "الصعوبة: {difficulty}",
      questionProgress: "السؤال {current} من {total}", score: "النتيجة: {score}",
      correct: "الإجابات الصحيحة", status: "الحالة", passed: "ناجح", tryAgain: "حاول مرة أخرى",
      levelCompleted: "اكتمل المستوى!", levelFailed: "لم تجتز المستوى",
      greatPerformance: "أداء رائع!", needThreeCorrect: "أجب عن 3 أسئلة بشكل صحيح لفتح المستوى التالي.",
      nextLevel: "المستوى التالي", backToLevels: "العودة إلى المستويات", exitQuiz: "الخروج من الاختبار",
      play: "العب", easy: "سهل", medium: "متوسط", hard: "صعب",
      levels: "المستويات", computers: "الحاسوب والتقنية", science: "العلوم والطبيعة",
      history: "التاريخ", generalKnowledge: "المعرفة العامة", geography: "الجغرافيا",
      notifications: "تفعيل الإشعارات", enterLevels: "اختر مستوى",
      arenaTitle: "ساحة الاختبارات", arenaDescription: "يُحفظ تقدمك على هذا الجهاز. العب الاختبارات والألعاب المصغرة دون اتصال."
    }
  };

  function applyLanguage(language) {
    const lang = translations[language] ? language : "en";
    localStorage.setItem("appLanguage", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" || lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const translation = translations[lang][element.dataset.i18n];
      if (translation) element.innerHTML = translation;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const translation = translations[lang][element.dataset.i18nPlaceholder];
      if (translation) element.setAttribute("placeholder", translation);
    });
    const selector = document.getElementById("appLanguage");
    if (selector) selector.value = lang;
    return lang;
  }

  window.appTranslate = function (key, replacements) {
    let value = translations[localStorage.getItem("appLanguage") || "en"][key] || translations.en[key] || key;
    for (const [name, replacement] of Object.entries(replacements || {})) {
      value = value.replace(`{${name}}`, String(replacement));
    }
    return value;
  };
  window.applyAppLanguage = applyLanguage;

  applyLanguage(localStorage.getItem("appLanguage") || "en");
  const selector = document.getElementById("appLanguage");
  if (selector) selector.addEventListener("change", () => applyLanguage(selector.value));
})();
