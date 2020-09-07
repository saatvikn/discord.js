module.exports = client => {
    console.log('ONLINE!');
    
        client.user.setPresence({
            status: 'online',
            activity: {
                name: 'bot template',
                type: 'STREAMING',
                url: 'https://twitch.tv/'
            }
        });
}