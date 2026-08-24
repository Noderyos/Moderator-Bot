/*
 * author : Mizari (Mizari-Dev)
 */
const { ApplicationCommandType, PermissionsBitField, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const ticketConfig = require('../../configuration/tickets.json');

module.exports = {
    name: "ticket-close",
      description: "Close the ticket.",
      descriptionLocalizations: {fr: "Fermer le ticket."},
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionsBitField.Flags.ManageChannels,
    options: [
        {
            name: "reason",
            description: "The reason you're closing the ticket.",
            descriptionLocalizations: {fr: "La raison pour laquelle vous fermez le ticket."},
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if (interaction.channel.parent.id !== ticketConfig.ticketCategory) {
            await interaction.reply({ephemeral: true, content: `Ce channel n'est pas un ticket.`});
            return;
        }
        await interaction.deferReply({ ephemeral: true });

        const ticketId = interaction.channel.name.split("-")[1];

        let transcriptFile;
        try {
            transcriptFile = await discordTranscripts.createTranscript(interaction.channel, {
                fileName: `ticket-${ticketId}.html`
            });
        } catch (err) {
            console.error('Error generating transcript:', err);
        }

        const logsChannel = client.channels.cache.get(ticketConfig.logsChannel);
        if (logsChannel) {
            const embedLog = new EmbedBuilder()
                .setTitle(`Ticket #${ticketId} fermé`)
                .setColor('#ff0000')
                .addFields(
                    { name: 'Raison de fermeture', value: args[0] ?? "Aucune raison donnée", inline: false },
                )

            if (transcriptFile) {
                await logsChannel.send({
                    embeds: [embedLog],
                    files: [transcriptFile]
                });
            } else {
                await logsChannel.send({
                    embeds: [embedLog]
                });
            }
        }

        await interaction.channel.delete();
    },
};
