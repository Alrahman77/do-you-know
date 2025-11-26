document.addEventListener('DOMContentLoaded', function() {
    // العناصر الأساسية
    const themeToggle = document.getElementById('themeToggle');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const shareBtn = document.getElementById('shareBtn');
    const screens = document.querySelectorAll('.screen');
    const playerCards = document.querySelectorAll('.player-card');
    const player1Form = document.getElementById('player1-form');
    const player2Form = document.getElementById('player2-form');
    const questionContainer1 = document.querySelector('#question-screen-1 .question-container');
    const questionContainer2 = document.querySelector('#question-screen-2 .question-container');
    const currentPlayerName = document.getElementById('current-player-name');
    const currentPlayerName2 = document.getElementById('current-player-name-2');
    const nextPlayerName = document.getElementById('next-player-name');
    const resultMessage = document.getElementById('result-message');
    const scorePercentage = document.getElementById('score-percentage');
    const circleProgress = document.querySelector('.circle-progress');
    const answersDetails = document.querySelector('.answers-details');
    
    // المتغيرات العامة
    let currentPlayerType = '';
    let currentPlayerTitle = '';
    let player1Answers = {};
    let player2Answers = {};

    // الأسئلة الأساسية
    const questions = {
      food: {
        brother: "ما هي أكلة أخوك المفضلة؟",
        sister: "ما هي أكلة أختك المفضلة؟", 
        father: "ما هي أكلة والدك المفضلة؟",
        mother: "ما هي أكلة والدتك المفضلة؟"
      },
      color: {
        brother: "ما هو لون أخوك المفضل؟",
        sister: "ما هو لون أختك المفضل؟",
        father: "ما هو لون والدك المفضل؟",
        mother: "ما هو لون والدتك المفضل؟"
      },
      movie: {
        brother: "ما هو فصل أخوك المفضل؟",
        sister: "ما هو فصل أختك المفضل؟",
        father: "ما هو فصل والدك المفضل؟",
        mother: "ما هو فصل والدتك المفضل؟"
      },
      hobby: {
        brother: "ما هي هواية أخوك المفضلة؟",
        sister: "ما هي هواية أختك المفضلة؟",
        father: "ما هي هواية والدك المفضلة؟",
        mother: "ما هي هواية والدتك المفضلة؟"
      },
      fear: {
        brother: "ما هي المادة الذي يفضلها أخوك؟",
        sister: "ما هي المادة الذي تفضلها أختك؟",
        father: "ما هي المادة الذي يفضلها والدك؟",
        mother: "ما هي المادة الذي تفضلها والدتك؟"
      },
      memory: {
        brother: "ما هي أجمل ذكرى مع أخوك؟",
        sister: "ما هي أجمل ذكرى مع أختك؟",
        father: "ما هي أجمل ذكرى مع والدك؟",
        mother: "ما هي أجمل ذكرى مع والدتك؟"
      },
      habit: {
        brother: "ما هي العادة المزعجة عند أخوك؟",
        sister: "ما هي العادة المزعجة عند أختك؟",
        father: "ما هي العادة المزعجة عند والدك؟",
        mother: "ما هي العادة المزعجة عند والدتك؟"
      },
      gift: {
        brother: "ما هي أفضل هدية ممكن تفرح أخوك؟",
        sister: "ما هي أفضل هدية ممكن تفرح أختك؟",
        father: "ما هي أفضل هدية ممكن تفرح والدك؟",
        mother: "ما هي أفضل هدية ممكن تفرح والدتك؟"
      },
      song: {
        brother: "ما هو الحيوان أخوك المفضلة؟",
        sister: "ما هو الحيوان أختك المفضلة؟",
        father: "ما هو الحيوان والدك المفضلة؟",
        mother: "ما هو الحيوان والدتك المفضلة؟"
      },
      skill: {
        brother: "ما هو الفنان الذي يفضله أخوك؟",
        sister: "ما هو الفنان الذي تفضله أختك؟",
        father: "ما هو الفنان الذي يفضله والدك؟",
        mother: "ما هو الفنان الذي تفضله والدتك؟"
      }
    };

    // 💡 دالة تحويل الصيغة إلى كاف المخاطب
    function convertToSecondPerson(question) {
        return question
            .replace(/أخوك/g, "ك")
            .replace(/أختك/g, "ك")
            .replace(/والدك/g, "ك")
            .replace(/والدتك/g, "ك")
            .replace(/مع ك/g, "معك") 
            .replace(/عند ك/g, "عندك");
    }

    // تبديل الوضع المظلم/الفاتح
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      themeToggle.textContent = isDark ? '☀' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // تحميل الوضع المحفوظ
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.textContent = '☀';
    }

    // عرض الشاشة المطلوبة
    function showScreen(screenId) {
      screens.forEach(screen => screen.classList.remove('active'));
      document.getElementById(screenId).classList.add('active');
    }

    // بدء اللعبة
    startBtn.addEventListener('click', function() {
      showScreen('player-screen');
    });

    // اختيار اللاعب
    playerCards.forEach(card => {
      card.addEventListener('click', function() {
        currentPlayerType = this.getAttribute('data-player');
        currentPlayerTitle = this.querySelector('h3').textContent;
        currentPlayerName.textContent = currentPlayerTitle;
        currentPlayerName2.textContent = currentPlayerTitle;
        nextPlayerName.textContent = currentPlayerTitle;

        createQuestions(questionContainer1, 'player1');
        showScreen('question-screen-1');
      });
    });

    // إنشاء الأسئلة
    function createQuestions(container, prefix) {
      container.innerHTML = '';

      Object.keys(questions).forEach(key => {
        let question = questions[key][currentPlayerType];

        // 👈 اللاعب الأول: تحويل لصيغة المخاطب
        if (prefix === 'player1') {
            question = convertToSecondPerson(question);
        }

        const div = document.createElement('div');
        div.className = "question-card";
        div.innerHTML = `
            <label>${question}</label>
            <input type="text" id="${prefix}-${key}" required autocomplete="off">
        `;
        container.appendChild(div);
      });
    }

    // حفظ إجابات اللاعب الأول
    player1Form.addEventListener('submit', function(e) {
      e.preventDefault();

      Object.keys(questions).forEach(key => {
        player1Answers[key] = document.getElementById(`player1-${key}`).value;
      });

      showScreen('transition-screen');
      let count = 3;
      const countdown = document.querySelector('.countdown');
      countdown.textContent = count;

      const timer = setInterval(() => {
        count--;
        countdown.textContent = count;

        if (count <= 0) {
          clearInterval(timer);
          createQuestions(questionContainer2, 'player2');
          showScreen('question-screen-2');
        }
      }, 1000);
    });

    // حفظ إجابات اللاعب الثاني
    player2Form.addEventListener('submit', function(e) {
      e.preventDefault();

      Object.keys(questions).forEach(key => {
        player2Answers[key] = document.getElementById(`player2-${key}`).value;
      });

      calculateResults();
      showScreen('result-screen');
    });

    // حساب النتائج
    function calculateResults() {
      let correct = 0;
      const total = Object.keys(questions).length;
      answersDetails.innerHTML = '';

      Object.keys(questions).forEach(key => {
        const isCorrect = player1Answers[key].toLowerCase() === player2Answers[key].toLowerCase();
        if (isCorrect) correct++;

        const q = questions[key][currentPlayerType];
        const div = document.createElement('div');
        div.className = `answer-item ${isCorrect ? 'correct' : 'wrong'}`;
        div.innerHTML = `
            <h4>${q}</h4>
            <p><strong>الإجابة الصحيحة:</strong> ${player1Answers[key]}</p>
            <p><strong>إجابتك:</strong> ${player2Answers[key]}</p>
        `;
        answersDetails.appendChild(div);
      });

      const percentage = Math.round((correct / total) * 100);
      scorePercentage.textContent = percentage + "%";

      circleProgress.style.transform = `rotate(${(percentage / 100) * 360}deg)`;

      if (percentage >= 80) {
          resultMessage.textContent = `ممتاز! أنت حافظ ${currentPlayerTitle}`;
      } else if (percentage >= 50) {
          resultMessage.textContent = `تمام، بس لسة محتاج تعرف أكتر عن ${currentPlayerTitle}`;
      } else {
          resultMessage.textContent = `للأسف… أنت مش حافظ ${currentPlayerTitle}`;
      }
    }

    restartBtn.addEventListener('click', () => {
      player1Answers = {};
      player2Answers = {};
      showScreen('player-screen');
    });
});
