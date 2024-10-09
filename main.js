import {
  BALL_SPEED_X,
  BALL_SPEED_Y,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_BACKGROUND_COLOR,
} from './const.js'

import {
  createPaddle,
  createBall,
  createBricks,
  createPauseText,
  updatePaddlePosition,
  updateBallPosition,
} from './gameElements.js'
import { handlePause } from './pause.js'
import { showGameOver } from './gameOver.js'

console.log('main')

// ゲームの基本設定
const app = new PIXI.Application()

;(async () => {
  console.log('main')
  await app.init({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: SCREEN_BACKGROUND_COLOR,
  })

  document.body.appendChild(app.view)

  // 背景画像の追加
  const backgroundAsset = await PIXI.Assets.load('./assets/background.png')
  //再利用する系の画像であれば、Textureを使用してキャッシュを作成しておく
  //今回は背景のため、Spriteを直接作成
  const background = PIXI.Sprite.from(backgroundAsset)

  // 背景を画面全体に広げる
  background.width = SCREEN_WIDTH
  background.height = SCREEN_HEIGHT
  app.stage.addChild(background)

  //オブジェクト関連
  let paddle, ball, bricks, pauseText
  let ballVelocity = { x: BALL_SPEED_X, y: BALL_SPEED_Y }

  //フラグ管理
  let isPaused = false
  let gameOver = false

  // キーボード入力の管理
  let moveLeft = false
  let moveRight = false

  // パドル、ボール、ブロックの作成
  paddle = createPaddle(app)
  ball = createBall(app, paddle)
  bricks = createBricks(app)
  pauseText = createPauseText(app)

  window.addEventListener('keydown', (event) => {
    // ポーズ機能
    if (event.code === 'Space') {
      isPaused = !isPaused
      handlePause(pauseText, isPaused)
    }
  })

  //移動機能
  window.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      moveLeft = true
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      moveRight = true
    }
  })

  window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      moveLeft = false
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      moveRight = false
    }
  })

  // ゲームループ
  app.ticker.add(() => {
    if (isPaused || gameOver) return

    updatePaddlePosition(moveLeft, moveRight, paddle, app)

    updateBallPosition(ball, ballVelocity, paddle, bricks, app, () => {
      showGameOver(app)
      gameOver = true
    })
  })
})()
