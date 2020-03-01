import { ReactElement } from 'react'
import ReactDOMServer from 'react-dom/server'

export function renderPage (title: string, page: ReactElement) {
  return wrapPage(title, ReactDOMServer.renderToStaticMarkup(page))
}

function wrapPage (title: string, content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/static/css/normalize.css">
  <link rel="stylesheet" href="/static/css/main.css">
  <title>${title}</title>
</head>
<body>${content}</body>
</html>
  `
}
