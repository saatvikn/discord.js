module.exports = client => {
    console.log('ONLINE!');
    
        client.user.setPresence({
            status: 'online',
            activity: {
                name: 'Made By Rayne',
                type: 'PLAYING',
            }
        });
}
