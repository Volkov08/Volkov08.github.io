const qrcode = require('qrcode-terminal');
const wa = require('whatsapp-web.js');
const fs = require('fs');
const client = new wa.Client();

var polls = JSON.parse(fs.readFileSync('polls.json'));
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {small: true});
});

client.on('ready', async function(){
  console.log('\u001b[32mClient is ready!\u001b[0m');
});

client.on('message', async msg => {
  let body = msg.body;
  let author = msg.author;
  if (body.includes('!poll')){
    let options = body.split('\n');
    let poll = {
      'name' : options[0].replace('!poll ',''),
      'author' : author,
      'options' : [],
      'optionsNames' : [],
      'voted' : [],
      'totalVotes' : 0
    };
    let reply = 'created poll:\n' + poll.name;
    for (let i = 1; i < options.length; i ++){
      poll.options.push(0);
      poll.optionsNames.push(options[i]);
      reply += '\n' + i + ' ' + options[i];
    }
    let replyMsg = await msg.reply(reply);
    let pollId = replyMsg.id.id;
    polls[pollId] = poll;

    fs.writeFileSync('polls.json', JSON.stringify(polls));
  } else if(msg.hasQuotedMsg && (body.includes('!vt') || body == '!rs' || body == '!cl')) {
    let pollMsg = await msg.getQuotedMessage();
    let pollId = pollMsg.id.id;
    if (pollId in polls) {
      if (body.includes('!vt')){
        let option = parseInt(body.split(' ')[1]);
        if (option <= polls[pollId].options.length && option > 0){
          if (!polls[pollId].voted.includes(author)){
            polls[pollId].voted.push(author);
            polls[pollId].options[option-1] ++;
            polls[pollId].totalVotes ++;
            fs.writeFileSync('polls.json', JSON.stringify(polls));
            msg.reply('you voted for ' + option + ' ' + polls[pollId].optionsNames[option-1] + ' of ' + polls[pollId].name);
          } else {
            msg.reply('you already voted!');
          }
        } else {
          msg.reply('that option is not available!');
        }
      } else if (body == '!rs'){
          msg.reply(results(polls[pollId]));
      } else if (body == '!cl'){
        if (polls[pollId].author == author) {
          msg.reply(results(polls[pollId]) + '\npoll closed!');
          delete polls[pollId];
          fs.writeFileSync('polls.json', JSON.stringify(polls));
        } else {
          msg.reply('you didn\'t create this poll');
        }
      }
    } else {
      msg.reply('message is not a poll or that poll is closed!');
    }
  }

  if (body == '!info') {
    let benutzung = fs.readFileSync('benutzung.txt', {encoding:'utf8', flag:'r'});
    let replyMsg = await msg.reply(benutzung);
    window.setTimeout(()=>{
      replyMsg.delete(true);
    },60000);
  }
});

function results(poll) {
  let reply = poll.name;
  let max = 0;
  for (let i = 0; i < poll.options.length; i ++){
    if (poll.options[i] > poll.options[max]){
      max = i;
    }
  }
  for (let i = 0; i < poll.options.length; i ++){
    let percent = 0;
    if (poll.totalVotes){
      percent = (100*poll.options[i]/poll.totalVotes).toFixed(1);
    }
    reply += '\n' + (i + 1) + ' ' + poll.optionsNames[i] + ' > ' + percent + "%"
    if (max == i){
      reply += '✓';
    }
  }
  return reply;
}

client.initialize();
