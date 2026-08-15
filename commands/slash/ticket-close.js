/*
 * author : Mizari (Mizari-Dev)
 */
const { ApplicationCommandType, PermissionsBitField } = require("discord.js");
const ticketConfig = require('../../configuration/tickets.json');

module.exports = {
    name: "ticket-close",
      description: "Close the ticket.",
      descriptionLocalizations: {fr: "Fermer le ticket."},
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionsBitField.Flags.ManageChannels,
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
        await interaction.channel.delete();
    },
};
