require('dotenv').config()

const rfr = require('rfr')
const fs = require('fs')
const { convertHtmlToDelta } = require('node-quill-converter');

rfr('config/db')

const NewsModel = rfr('modules/v1/news/model').model

const newsFormatter = (news) => {
    const {title, slug, content, created_at, updated_at} = news

    return {
        title,
        slug,
        content: convertHtmlToDelta(content),
        createdAt: created_at,
        updatedAt: updated_at
    }
}

const writeOutput = (data) => {
    const output = `db.news.insert(${JSON.stringify(data)})`

    return fs.writeFile('./news_output.txt', output, 'utf8')
}

const getAllNews = async () => {
    const data = await NewsModel
    .find({})
    .sort({'created_at': 1})
    .limit(999999)
    .exec()
    
    const newData = data.map(newsFormatter)
    return writeOutput(newData)
}

(async () => {
    console.log(`Iniciando..`)
    await getAllNews()
    console.log('Finalizado.')

    return -1
})()