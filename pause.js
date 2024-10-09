let blinkCounter = 0
const blinkInterval = 30 // テキストが点滅する間隔（フレーム数）

export function handlePause(pauseText, isPaused) {
  if (isPaused) {
    pauseText.visible = true // ポーズ時にテキスト表示
  } else {
    pauseText.visible = false // ポーズ解除時にテキスト非表示
  }

  // 点滅ロジック
  if (isPaused) {
    blinkCounter++
    if (blinkCounter >= blinkInterval) {
      pauseText.visible = !pauseText.visible // 表示/非表示を切り替え
      blinkCounter = 0
    }
  }
}
