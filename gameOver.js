export function showGameOver(app) {
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
