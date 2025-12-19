export const isPermanentStage = ['dev', 'production'].includes($app.stage)

export const domain = (() => {
  if ($app.stage === 'production') return 'csvkonverter.de'
  if ($app.stage === 'dev') return 'dev.csvkonverter.de'
  return `${$app.stage}.dev.csvkonverter.de`
})()
