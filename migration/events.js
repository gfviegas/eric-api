require('dotenv').config()

const rfr = require('rfr')
const fs = require('fs')
const { convertHtmlToDelta } = require('node-quill-converter');

rfr('config/db')

const EventsModel = rfr('modules/v1/event/model').model

const eventFormatter = (event) => {
    const {title, slug, description, place, start_date, end_date, section, hosts, created_at, updated_at, files} = event

    return {
        title,
        slug,
        content: convertHtmlToDelta(`<p>${description}</p>`),
        createdAt: new Date(created_at),
        updatedAt: new Date(updated_at),
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        where: place,
        section,
        responsible: hosts.join(', '),
        files
    }
}

const writeOutput = (data) => {
    const output = `db.events.insert(${JSON.stringify(data)})`

    return fs.writeFile('./event_output.txt', output, 'utf8')
}

const getAllEvents = async () => {
    const data = await EventsModel
    .find({})
    .sort({'created_at': 1})
    .limit(999999)
    .exec()
    
    const newData = data.map(eventFormatter)
    return writeOutput(newData)
}

return (async () => {
    console.log(`Iniciando..`)
    await getAllEvents()
    console.log('Finalizado.')

    return -1
})()