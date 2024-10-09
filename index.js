// キーボード入力
let keys = {}
window.addEventListener('keydown', (e) => {
  keys[e.key] = true
})
window.addEventListener('keyup', (e) => {
  keys[e.key] = false
})

const app = new PIXI.Application()

// PixiJSアプリケーションの作成
;(async () => {
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
  })

  document.body.appendChild(app.canvas)

  //ゲームステータス
  let isPaused = false
  let gameOver = false

  //パドルの生成
  const paddleWidth = 100
  const paddleHeight = 20

  // パドルの作成
  const paddle = new PIXI.Graphics()
    .rect(0, 0, paddleWidth, paddleHeight)
    .fill(0xffffff)

  paddle.x = (app.screen.width - paddleWidth) / 2
  paddle.y = app.screen.height - 50
  app.stage.addChild(paddle)

  // ボールの作成
  const ballRadius = 10
  const ball = new PIXI.Graphics().circle(0, 0, ballRadius).fill(0xff0000)
  ball.x = app.screen.width / 2
  ball.y = app.screen.height / 2
  app.stage.addChild(ball)

  // ブリックの作成
  const brickRows = 5
  const brickCols = 8
  const brickWidth = 80
  const brickHeight = 30
  const brickPadding = 10
  let bricks = []
  function createBricks() {
    for (let row = 0; row < brickRows; row++) {
      bricks[row] = []
      for (let col = 0; col < brickCols; col++) {
        let brick = new PIXI.Graphics()
          .rect(0, 0, brickWidth, brickHeight)
          .fill(0x00ff00)
        brick.x = col * (brickWidth + brickPadding)
        brick.y = row * (brickHeight + brickPadding)
        app.stage.addChild(brick)
        bricks[row][col] = brick
      }
    }
  }

  createBricks()

  // ゲームオーバー表示
  function showGameOver() {
    gameOver = true
    let style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 'red',
    })
    let gameOverText = new PIXI.Text('Game Over', style)
    gameOverText.x = (app.screen.width - gameOverText.width) / 2
    gameOverText.y = (app.screen.height - gameOverText.height) / 2
    app.stage.addChild(gameOverText)
  }

  // ポーズ画面点滅用のタイマー変数
  let blinkCounter = 0;
  const blinkInterval = 30; // テキストが点滅する間隔（フレーム数）

  // ポーズメニュー表示
  let pauseText
  function createPauseText() {
    let style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 'black',
    })
    pauseText = new PIXI.Text('Pause', style)
    pauseText.x = (app.screen.width - pauseText.width) / 2
    pauseText.y = (app.screen.height - pauseText.height) / 2
    pauseText.visible = false
    app.stage.addChild(pauseText)
    console.log('funtion内' + pauseText)
  }
  await createPauseText()
  // ポーズ機能
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      isPaused = !isPaused
      pauseText.visible = isPaused // ポーズ時にテキスト表示
    }
  })

  // ボールのベクトル
  let ballVelocity = { x: 5, y: 5 }

  // ゲームループ
  app.ticker.add(() => {
    if (isPaused) {
      // 点滅ロジック
      blinkCounter++;
      if (blinkCounter >= blinkInterval) {
          pauseText.visible = !pauseText.visible; // 表示/非表示を切り替え
          blinkCounter = 0; // カウンターをリセット
      }
      return; // ポーズ中はゲームを止める
    }

    if (gameOver) return

    // パドルの移動
    if (keys['ArrowLeft'] && paddle.x > 0) {
      paddle.x -= 10
    }
    if (keys['ArrowRight'] && paddle.x < app.screen.width - paddleWidth) {
      paddle.x += 10
    }

    // ボールの移動
    ball.x += ballVelocity.x
    ball.y += ballVelocity.y

    // 壁との衝突
    if (ball.x - ballRadius < 0 || ball.x + ballRadius > app.screen.width) {
      ballVelocity.x *= -1
    }
    if (ball.y - ballRadius < 0) {
      ballVelocity.y *= -1
    }

    // パドルとの衝突
    if (
      ball.y + ballRadius > paddle.y &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddleWidth
    ) {
      ballVelocity.y *= -1
    }

    // ブリックとの衝突
    for (let row = 0; row < brickRows; row++) {
      for (let col = 0; col < brickCols; col++) {
        let brick = bricks[row][col]
        if (
          brick &&
          ball.x > brick.x &&
          ball.x < brick.x + brickWidth &&
          ball.y > brick.y &&
          ball.y < brick.y + brickHeight
        ) {
          app.stage.removeChild(brick)
          bricks[row][col] = null
          ballVelocity.y *= -1
        }
      }
    }

    // 底に落ちたらゲームオーバー
    if (ball.y + ballRadius > app.screen.height) {
      showGameOver()
    }
  })
})()
