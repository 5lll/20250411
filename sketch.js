let radio;
let button;
let result = "";
let questionData;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let input;

function preload() {
  // 載入 CSV 檔案
  questionData = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  // 產生一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  // 設定畫布背景色
  background("#e76f51");

  // 設定選項
  radio = createRadio();
  radio.style('color', '#023047');
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 50);

  // 設定文字框
  input = createInput();
  input.position(windowWidth / 2 - 50, windowHeight / 2 + 50);
  input.hide();

  // 設定按鈕
  button = createButton('下一題');
  button.position(windowWidth / 2 - 20, windowHeight / 2 + 100);
  button.mousePressed(nextQuestion);

  // 顯示第一題
  displayQuestion();
}

function draw() {
  background("#e76f51");
  
  // 設定矩形顏色
  fill("#ffc8dd");
  noStroke();
  
  // 在視窗中間產生一個寬為全視窗的1/2, 高為視窗高的1/2的矩形
  rect(windowWidth / 4, windowHeight / 4, windowWidth / 2, windowHeight / 2);

  // 顯示題目
  fill(0);
  textSize(35);
  textAlign(CENTER);
  text(questionData.getString(currentQuestionIndex, 'question'), windowWidth / 2, windowHeight / 2);

  // 顯示結果
  textSize(20);
  text(result, windowWidth / 2, windowHeight / 2 + 150);
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 50);
  input.position(windowWidth / 2 - 50, windowHeight / 2 + 50);
  button.position(windowWidth / 2 - 20, windowHeight / 2 + 100);
}

function displayQuestion() {
  // 清空選項
  radio.elt.innerHTML = '';
  input.hide();

  // 取得當前題目和選項
  let question = questionData.getString(currentQuestionIndex, 'question');
  let options = [
    questionData.getString(currentQuestionIndex, 'option1'),
    questionData.getString(currentQuestionIndex, 'option2'),
    questionData.getString(currentQuestionIndex, 'option3'),
    questionData.getString(currentQuestionIndex, 'option4')
  ];

  // 判斷是否為填空題
  if (options[0] === '' && options[1] === '' && options[2] === '' && options[3] === '') {
    input.show();
  } else {
    // 設定選項
    options.forEach((option, index) => {
      radio.option(option);
    });
  }

  // 更新畫面
  redraw();
}

function nextQuestion() {
  // 檢查答案
  let correctAnswer = questionData.getString(currentQuestionIndex, 'answer');
  if (input.value() !== '') {
    // 填空題檢查
    if (input.value() === correctAnswer) {
      correctAnswers++;
      result = "答對了";
    } else {
      result = "答錯了";
    }
    input.value('');
  } else {
    // 選擇題檢查
    if (radio.value() === correctAnswer) {
      correctAnswers++;
      result = "答對了";
    } else {
      result = "答錯了";
    }
  }

  // 移動到下一題
  currentQuestionIndex++;
  if (currentQuestionIndex < questionData.getRowCount()) {
    displayQuestion();
  } else {
    // 所有題目都回答完畢
    result = `測驗結束！你答對了 ${correctAnswers} 題。`;
    button.html('再試一次');
    button.mousePressed(restartQuiz);
  }
}

function restartQuiz() {
  // 重置測驗
  currentQuestionIndex = 0;
  correctAnswers = 0;
  result = "";
  button.html('下一題');
  button.mousePressed(nextQuestion);
  displayQuestion();
}