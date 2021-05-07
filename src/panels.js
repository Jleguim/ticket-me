const mongoose = require('mongoose')

const PanelModel = mongoose.models.Panel
const Panel = require('./classes/Panel.class')
const PanelOptions = require('./classes/PanelOptions.class')

const panels = new Map()

async function loadPanels() {
    var ps = await PanelModel.find({})

    ps.forEach(element => {
        var p = Panel.revive(element)
        panels.set(element.id, p)
    })

    return getPanels()
}

function createPanel(channel_id, category_id) {
    const myPanel = new Panel(channel_id, category_id)
    const panelObj = myPanel.toJSON()

    const element = new PanelModel(panelObj)
    element.save()

    myPanel.doc_id = element.id
    panels.set(element.id, myPanel)
    return myPanel
}

function getPanels() {
    return Array.from(panels.values())
}

module.exports = { createPanel, getPanels, loadPanels }