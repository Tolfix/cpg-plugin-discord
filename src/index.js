require("dotenv").config();
const Events = require("events");
const { Application } = require("express");
const { WebhookClient, MessageEmbed } = require("discord.js");

module.exports = class DiscordWebhook {
    /**
     * 
     * @param {Events} mainEvent 
     * @param {Application} server 
     * @param {{
     *  CategoryModel: CategoryModel,
     *  CustomerModel: CustomerModel,
     *  ImageModel: ImageModel,
     *  InvoiceModel: InvoiceModel,
     *  OrderModel: OrderModel,
     *  ProductModel: ProductModel,
     *  TransactionsModel: TransactionsModel,
     * }} models 
     */
    constructor(mainEvent, server, models, Logger) {
        this.mainEvent = mainEvent;
        this.server = server;
        this.models = models;
        this.Logger = Logger;

        this.discord_webhook_url = process.env.DISCORD_WEBHOOK_URL;

        if(!this.discord_webhook_url)
            return this.Logger.plugin("Discord webhook url not set");

        this.mainEvent.on("invoice_paid", invoice => {
            this.sendWebhook("Invoice paid", {
                text: `Invoice \`id #${invoice.id}\` has been paid.`,
            })
        });

        this.mainEvent.on("invoice_created", invoice => {
            this.sendWebhook("Invoice created", {
                text: `Invoice \`id #${invoice.id}\` has been created.`,
            })
        });

        this.mainEvent.on("invoice_deleted", invoice => {
            this.sendWebhook("Invoice created", {
                text: `Invoice \`id #${invoice.id}\` has been deleted.`,
            })
        });

        this.mainEvent.on("invoice_updated", invoice => {
            this.sendWebhook("Invoice updated", {
                text: `Invoice \`id #${invoice.id}\` has been updated.`,
            })
        });

        this.mainEvent.on("invoice_notified", invoice => {
            this.sendWebhook("Invoice notified", {
                text: `Invoice \`id #${invoice.id}\` has been notified.`,
            })
        });

        this.mainEvent.on("order_created", order => {
            this.sendWebhook("order created", {
                text: `Order \`id #${order.id}\` has been created.`,
            })
        });

        this.mainEvent.on("order_deleted", order => {
            this.sendWebhook("order created", {
                text: `Order \`id #${order.id}\` has been deleted.`,
            })
        });

        this.mainEvent.on("order_updated", order => {
            this.sendWebhook("order updated", {
                text: `Order \`id #${order.id}\` has been updated.`,
            })
        });

    }

    /**
     * 
     * @param {String} title 
     * @param {{
     * embeds?: MessageEmbed[],
     * text?: String,
     * }} data 
     */
    sendWebhook(title, data)
    {
        const webhookClient = new WebhookClient({
            url: this.discord_webhook_url
        });

        let d = {
            title: title,
        }

        if(data.text)
            d.content = data.text;

        if(data.embeds)
            d.embeds = data.embeds;

        webhookClient.send(d);
    }
}