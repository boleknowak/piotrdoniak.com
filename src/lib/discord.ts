type DiscordWebhookData = {
  webhookUrl: string;
  content: string;
  embeds?: {
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    author?: {
      name?: string;
      url?: string;
      icon_url?: string;
    };
  }[];
};

export const sendDiscordWebhook = async (data: DiscordWebhookData) => {
  await fetch(data.webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      avatar_url: 'https://i.imgur.com/IwUkSVN.png',
      content: data.content,
      embeds: data.embeds,
    }),
  });
};
