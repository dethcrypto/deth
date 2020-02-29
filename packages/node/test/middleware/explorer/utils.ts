import { Application } from 'express'
import { expect, request } from 'chai'
import cheerio from 'cheerio'

export async function getPage (app: Application, path: string) {
  const response = await request(app).get(path)
  expect(response.ok).to.equal(true)
  return cheerio.load(response.text)
}
