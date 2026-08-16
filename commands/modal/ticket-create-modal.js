/*
 * author : Syxles (Syxless) & Mizari (Mizari-Dev)
 */
const {
    ChannelType,
    ActionRowBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const ticketConfig = require('../../configuration/tickets.json');

module.exports = {
    name: "ticket-create-modal",
    type: "Modal",
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {

        await interaction.deferReply({ ephemeral: true });

        // Générer un ID unique pour le ticket (si tu ne le gères pas via @default(cuid()))
        const ticketId = Date.now().toString(36).toUpperCase();

        // Créer le salon de ticket
        const channel = await interaction.guild.channels.create({
            name: `ticket-${ticketId}`,
            type: ChannelType.GuildText,
            parent: ticketConfig.ticketCategory,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },
                ...ticketConfig.staffRoles.map(r => ({
                    id: r,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.ManageMessages
                    ]
                }))
            ]
        });

        const openReason = interaction.fields.getTextInputValue('ticketOpenReason');
        const type = interaction.ticketId;

        // Créer un embed de bienvenue dans le salon de ticket
        const tpl = ticketConfig.templates[type] || ticketConfig.templates['general'];
        const embed = new EmbedBuilder()
            .setColor(tpl.color || '#2B2D31')
            .setTitle(`${tpl.emoji || '🎫'} Ticket #${ticketId}`)
            .setDescription(`Ticket créé par <@${interaction.user.id}>.\n\n**Raison** : ${openReason}`)
            .setTimestamp();

        await channel.send({ embeds: [embed] });

        // Informer l'utilisateur que le ticket a été créé
        await interaction.editReply({ content: `Ticket créé : <#${channel.id}>`, ephemeral: true });
    }
}
