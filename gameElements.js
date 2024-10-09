/* ゲーム動作関連 */
import {
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_COLOR,
  BALL_RADIUS,
  BRICK_ROWS,
  BRICK_COLS,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_PADDING,
  BRICK_OFFSET_TOP,
  BRICK_OFFSET_LEFT,
  BRICK_COLOR,
} from './const.js'

// パドルの作成
export function createPaddle(app) {
  let paddle = new PIXI.Graphics()
  paddle.beginFill(PADDLE_COLOR)
  paddle.drawRect(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT)
  paddle.endFill()
  paddle.x = (app.screen.width - PADDLE_WIDTH) / 2
  paddle.y = app.screen.height - PADDLE_HEIGHT - 10
  app.stage.addChild(paddle)
  return paddle
}

// ボールの作成
export function createBall(app, paddle) {
  let ball = new PIXI.Graphics().circle(0, 0, BALL_RADIUS).fill(0xff0000)
  ball.x = paddle.x + paddle.width / 2
  ball.y = paddle.y - BALL_RADIUS
  app.stage.addChild(ball)
  return ball
}

// ブロックの作成
export function createBricks(app) {
  const bricks = []

  for (let col = 0; col < BRICK_COLS; col++) {
    bricks[col] = []
    for (let row = 0; row < BRICK_ROWS; row++) {
      let brick = new PIXI.Graphics()
        .rect(0, 0, BRICK_WIDTH, BRICK_HEIGHT)
        .fill(BRICK_COLOR)
      brick.x = col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT
      brick.y = row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP
      app.stage.addChild(brick)
      bricks[col][row] = brick
    }
  }
  return bricks
}

// ポーズテキストの作成
export function createPauseText(app) {
  let pauseText
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
  return pauseText
}

// パドルの位置更新
export function updatePaddlePosition(moveLeft, moveRight, paddle, app) {
  // パドルの移動
  if (moveLeft) {
    paddle.x = Math.max(0, paddle.x - PADDLE_SPEED)
  }
  if (moveRight) {
    paddle.x = Math.min(
      app.screen.width - paddle.width,
      paddle.x + PADDLE_SPEED
    )
  }
}

// ボールの位置更新
export function updateBallPosition(
  ball,
  ballVelocity,
  paddle,
  bricks,
  app,
  onGameOver
) {
  ball.x += ballVelocity.x
  ball.y += ballVelocity.y

  // 壁に当たると反射
  //右と左の判定
  if (ball.x + BALL_RADIUS > app.screen.width || ball.x - BALL_RADIUS < 0) {
    ballVelocity.x = -ballVelocity.x
  }
  //上の判定(下はゲームオーバーのためこちらで判定しない)
  if (ball.y - BALL_RADIUS < 0) {
    ballVelocity.y = -ballVelocity.y
  }

  // パドルとの衝突
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + PADDLE_WIDTH &&
    ball.y + BALL_RADIUS > paddle.y
  ) {
    ballVelocity.y = -ballVelocity.y
  }

  // ブロックとの衝突
  for (let c = 0; c < bricks.length; c++) {
    for (let r = 0; r < bricks[c].length; r++) {
      let brick = bricks[c][r]
      if (
        brick &&
        ball.x > brick.x &&
        ball.x < brick.x + BRICK_WIDTH &&
        ball.y - BALL_RADIUS < brick.y + BRICK_HEIGHT &&
        ball.y + BALL_RADIUS > brick.y
      ) {
        app.stage.removeChild(brick)
        bricks[c][r] = null
        ballVelocity.y = -ballVelocity.y
      }
    }
  }

  // 底に落ちたらゲームオーバー
  if (ball.y + BALL_RADIUS > app.screen.height) {
    onGameOver()
  }
}
