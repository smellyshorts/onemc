const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

const endpoint = "https://api.mcsrvstat.us/bedrock/3/";

async function query(address, channel) {
    try {
        const raw = await fetch(endpoint + address);
        const data = await raw.json();

        if (!data["online"]) {
            const offlineEmbed = new MessageEmbed()
                .setColor('#ff69b4') 
                .setDescription("Server is offline.")
                .setTimestamp();
                
            return channel.send({ embeds: [offlineEmbed] });
        }

        const queryEmbed = new MessageEmbed()
            .setColor('#ff69b4') 
            .setTitle(address)
            .addFields(
                { name: '**MOTD**', value: String(data['motd']['raw'])},
                { name: '**Version**', value: String(data['version']) },
                { name: '**Software**', value: String(data['software']) },
                { name: '**Protocol**', value: `v:${data['protocol']['version']} : n:${data['protocol']['name']}` },
                { name: '**Players**', value: `${data['players']['online']}/${data['players']['max']}`}
            )
            .setTimestamp();

        channel.send({ embeds: [queryEmbed] });
    } catch (error) {
        console.error('Error querying server:', error);
        const errorEmbed = new MessageEmbed()
            .setColor('#ff69b4') 
            .setTitle('Error')
            .setDescription('An error occurred while querying the server.')
            .setTimestamp();
        
        channel.send({ embeds: [errorEmbed] });
    }
}

module.exports = {
    name: 'query', 
    description: 'Query a Minecraft Bedrock server',
    execute(message, args) { 

        if (!args.length) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff69b4')
                .setTitle('Error')
                .setDescription('Please provide the address of the server to query.')
                .setTimestamp();
            
            return message.channel.send({ embeds: [errorEmbed] });
        }

        const address = args[0];
        query(address, message.channel);
    },
};
