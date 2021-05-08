const Discord = require('discord.js')

class Form {
    constructor(target, channel, questions = [{ q: 'Papi que, Moto?', err, f }]) {
        this.questions = questions
        this.answers = []

        this.messagesToDelete = []

        this.target = target
        this.channel = channel

        this.collector = new Discord.MessageCollector(this.channel, m => m.author.id == this.target.id, { time: 60000 })
    }

    set callback(cb) {
        this.collector.on('end', () => cb(this.answers, this.messagesToDelete))
    }

    sendQuestion({ q }) {
        var embed = this.createEmbed(q)
        this.channel.send(embed)
            .then(msg => {
                this.messagesToDelete.push(msg.id)
            })
    }

    async exec() {
        var index = 0

        this.sendQuestion(this.questions[0])

        this.collector.on('collect', (message) => {
            var myQuestion = this.questions[index]

            const filter = (myQuestion.f) ? myQuestion.f : (v) => v
            const err = (myQuestion.err) ? myQuestion.err : 'There was some type of error.'

            if ((typeof filter) !== 'function')
                throw 'filter needs to be a func'

            var answer = filter(message.content)
            if (!answer) return message.channel.send(err)
            else {
                index++

                this.answers.push(answer)
                this.messagesToDelete.push(message.id)

                if (index >= this.questions.length)
                    return this.collector.stop()

                this.sendQuestion(this.questions[index])
            }
        })

    }

    createEmbed(quest) {
        const embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setFooter(quest)
        return embed
    }
}

module.exports = Form