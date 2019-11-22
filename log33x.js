const roles = {
	"police": "440179885760184320" // ضع ايدي رتبة الشرطي هنا, حتى يستطيع اضافة وحذف ومعرفة سجلات المواطن
};
const prefix = '-'; // بادئ الأمر (!logs)
const channel = '630360205804306452'; // ضع ايدي القناة المراد بها حصر الأوامر فيها


const Discord = require( 'discord.js' );
const fs = require( 'fs' );
const ms = require( 'ms' );
const client = new Discord.Client( );
let logs = JSON.parse( fs.readFileSync( 'logs2.json' ) );
let logio = JSON.parse( fs.readFileSync( 'logio2.json' ) );
let log = {};

client.on('message', ( message ) => {
	if( message.guild ){ 
		if( message.content.startsWith(prefix) ){
			if( !message.author.bot ){ 
				if( message.channel.id != channel ) return;
				const args = message.content.slice(prefix.length).trim().split(/ +/g);
				const command = args.shift().toLowerCase();
				if (  command == 'addlog' ){
					if( message.member.roles.get(roles['police']) ){
						if( args[0] && !isNaN(args[0]) ){
							if( args[1] && !isNaN(args[1]) ) {
								if( args[2] && !isNaN(args[2]) ) {
									if( args[3] ) {
										var reason = message.content.slice(prefix.length).trim().split(/ +/g).slice( 4 ).join( " " );
										if( logs[args[0]] ){
											logs[ args[0] ].push(
												{
													fromID: message.member.id,
													from: message.member.displayName,
													to: args[0],
													fine: args[1],
													dration: args[2],
													reason: reason
												}
											)
										} else {
											logs[ args[0] ] = [
												{
													fromID: message.member.id,
													from: message.member.displayName,
													to: args[0],
													fine: args[1],
													dration: args[2],
													reason: reason
												}
											]									
										}
										const embed = new Discord.RichEmbed()
										  .setTitle("**أضافة سجل جديد على " + args[0] + "**")
										  .setAuthor(message.member.displayName, message.member.user.avatarURL)
										  .setColor("#00ff00")
										  .setTimestamp()
										  .addField("**العسكري**",':cop: ' + message.member.displayName,true)
										  .addField("**المتهم**",':bust_in_silhouette: [' + args[0] + ']',true)
										  .addField("**الغرامة**",':moneybag: ' + args[1] + '$',true)

										  .addField("**المدة**",':calendar_spiral: ' + args[2] + ' شهور',true)
										  .addField("**السبب**",reason,true)
										message.reply( embed );
										fs.writeFileSync( 'logs.json', JSON.stringify( logs ) );
									} else {
										message.reply("**:x: يرجى تحديد السبب**");
									}
								} else {
									message.reply("**:x: يرجى تحديد المدة**");
								}
							} else {
								message.reply("**:x: يرجى تحديد الغرامة**");
							}
						} else {
							message.reply("**:x: يرجى تحديد الأيدي**");
						}
					} else {
						message.reply("**:x: ليس لديك الصلاحيات الكافية لفعل هذا الأمر**");
					}
				} else if ( command == 'removelog' ){
					if( message.member.roles.get(roles['police']) ){
						if( args[0] && !isNaN(args[0]) ){
							if( logs[ args[0] ] && logs[ args[0] ].length > 0 ) {
								logs[ args[0] ].pop()
								const embed = new Discord.RichEmbed()
								  .setTitle("**حذف سجل من " + args[0] + "**")
								  .setAuthor(message.member.displayName, message.member.user.avatarURL)
								  .setColor("#ff0000")
								  .setTimestamp()
								  .addField("**المسؤول**",':cop: ' + message.member.displayName,true)
								  .addField("**المتهم**",':bust_in_silhouette: [' + args[0] + ']',true)
								message.reply( embed );
								fs.writeFileSync( 'logs.json', JSON.stringify( logs ) );
							} else {
								message.reply("**:x: لا يوجد سجل على هذا الشخص**");
							}
						} else {
							message.reply("**:x: يرجى تحديد الشخص المراد حذف سجله**");
						}
					} else {
						message.reply("**:x: ليس لديك الصلاحيات الكافية لفعل هذا الأمر**");
					}
				} else if ( command == 'logs' ){
					if( message.member.roles.get(roles['police']) ){
						if( args[0] && !isNaN(args[0]) ){
							if( logs[ args[0] ] && logs[ args[0] ].length > 0 ) {
								if( logs[ args[0] ].length <= 3 ){
								const embed = new Discord.RichEmbed()
								  .setTitle("**["+ args[0] +"] السجلات على**")
								  .setAuthor(message.member.displayName, message.member.user.avatarURL)
								  .setColor("#36393f")
								  .setTimestamp()
									var index = 0;
									logs[ args[0] ].forEach( ( log ) => {
										index++;
										embed.addField("**العسكري**",':cop: ' + log.from || "عسكري سابق",true)
										embed.addField("**المتهم**",':bust_in_silhouette: [' + log.to + ']',true)
										embed.addField("**الغرامة**",':moneybag: ' + log.fine + '$',true)
										embed.addField("**المدة**",':calendar_spiral: ' + log.dration + ' شهور',true)
										embed.addField("**السبب**",log.reason,true)
										if( index >= logs[ args[0] ].length ){
											message.reply( embed );
										} else {
											embed.addField("-", '\u200b')
										}
									});
								} else {
									embeds = [];
									var i;
									for (i = 0; i < Math.ceil(logs[ args[0] ].length/3); i++) { 
										embeds[i] = new Discord.RichEmbed()
										  .setTitle("**["+ args[0] +"] السجلات على**")
										  .setAuthor(message.member.displayName, message.member.user.avatarURL)
										  .setColor("#36393f")
										  .setTimestamp()
										  .setDescription( 'الصفحة: '+ ( i + 1 ) +'/'+ Math.ceil(logs[ args[0] ].length/3) )
										var index = 0;
										logs[ args[0] ].forEach( ( log ) => {
											index++;
											if( index > (3 * ( i + 1 ) ) - 3 && index <= ( 3 * ( i + 1 ) ) ){
												embeds[i].addField("**العسكري**",':cop: ' + log.from || "عسكري سابق",true)
												embeds[i].addField("**المتهم**",':bust_in_silhouette: [' + log.to + ']')
												embeds[i].addField("**الغرامة**",':moneybag: ' + log.fine + '$',true)
												embeds[i].addField("**المدة**",':calendar_spiral: ' + log.dration + ' شهور',true)
												embeds[i].addField("**السبب**",log.reason,true)
												if( index < ( 3 * ( i + 1 ) ) ) {
													embeds[i].addField("-", '\u200b')
												}
											}
										});
									}
									var member = message.member.id;
									message.reply( embeds[0] ).then ( (m) => {
										m.react( '◀' ).then( () => { 
											m.react( '▶' ).then( () => {
												const filter = (reaction, user) => reaction.emoji.name == '▶' || reaction.emoji.name == '◀' && !user.bot && user.id == member
												const collector = m.createReactionCollector(filter, { });
												var number = 0;
												collector.on('collect', (reaction) => {
													if( !reaction.users.last().bot && reaction.users.last().id == member ){
														if( reaction.emoji.name == '▶' ){
															if( number < Math.ceil(logs[ args[0] ].length/3) ){
																number++;
																m.edit( message.member, embeds[ number ] );
															}
														} else if ( reaction.emoji.name == '◀' ){
															if( number > 0 ){
																number--;
																m.edit( message.member, embeds[ number ] );
															}
														}
													}
												});
											})
										})
									} );
								}
							} else {
								message.reply("**:x: لاتوجد هناك سجلات على الشخص**");
							}
						} else {
							message.reply("**:x: يرجى تحديد الشخص المراد معرفة سجله**");
						}
					} else {
						message.reply("**:x: ليس لديك الصلاحيات الكافية لفعل هذا الأمر**");
					}
				} else if ( command == 'coplogs' ){
					if( message.member.roles.get(roles['police']) ){
						if( args[0] && message.mentions.members.first() ){
							let cop = message.mentions.members.first();
							if( cop.roles.get(roles['police']) ){
								let coplogs = [];
								for(log in logs){
									if( logs.hasOwnProperty(log) ){
										logs[log].forEach( (copLog) => {
											if( copLog.fromID == cop.id ){
												coplogs.push(copLog)
											}
										} );
									}
								}
								if( coplogs && coplogs.length > 0 ) {
									if( coplogs.length <= 3 ){
									const embed = new Discord.RichEmbed()
									  .setTitle("**["+ cop.displayName +"] السجلات لـ**")
									  .setAuthor(message.member.displayName, message.member.user.avatarURL)
									  .setColor("#36393f")
									  .setTimestamp()
										var index = 0;
										coplogs.forEach( ( log ) => {
											index++;
											embed.addField("**العسكري**",':cop: ' + log.from || "عسكري سابق",true)
											embed.addField("**المتهم**",':bust_in_silhouette: [' + log.to + ']',true)
											embed.addField("**الغرامة**",':moneybag: ' + log.fine + '$',true)
											embed.addField("**المدة**",':calendar_spiral: ' + log.dration + ' شهور',true)
											embed.addField("**السبب**",log.reason,true)
											if( index >= coplogs.length ){
												message.reply( embed );
											} else {
												embed.addField("-", '\u200b')
											}
										});
									} else {
										embeds = [];
										var i;
										for (i = 0; i < Math.ceil(coplogs.length/3); i++) { 
											embeds[i] = new Discord.RichEmbed()
											  .setTitle("**["+ cop.displayName +"] السجلات لـ**")
											  .setAuthor(message.member.displayName, message.member.user.avatarURL)
											  .setColor("#36393f")
											  .setTimestamp()
											  .setDescription( 'الصفحة: '+ ( i + 1 ) +'/'+ Math.ceil(coplogs.length/3) )
											var index = 0;
											coplogs.forEach( ( log ) => {
												index++;
												if( index > (3 * ( i + 1 ) ) - 3 && index <= ( 3 * ( i + 1 ) ) ){
													embeds[i].addField("**العسكري**",':cop: ' + log.from || "عسكري سابق",true)
													embeds[i].addField("**المتهم**",':bust_in_silhouette: [' + log.to + ']')
													embeds[i].addField("**الغرامة**",':moneybag: ' + log.fine + '$',true)
													embeds[i].addField("**المدة**",':calendar_spiral: ' + log.dration + ' شهور',true)
													embeds[i].addField("**السبب**",log.reason,true)
													if( index < ( 3 * ( i + 1 ) ) ) {
														embeds[i].addField("-", '\u200b')
													}
												}
											});
										}
										var member = message.member.id;
										message.reply( embeds[0] ).then ( (m) => {
											m.react( '◀' ).then( () => { 
												m.react( '▶' ).then( () => {
													const filter = (reaction, user) => reaction.emoji.name == '▶' || reaction.emoji.name == '◀' && !user.bot && user.id == member
													const collector = m.createReactionCollector(filter, { });
													var number = 0;
													collector.on('collect', (reaction) => {
														if( !reaction.users.last().bot && reaction.users.last().id == member ){
															if( reaction.emoji.name == '▶' ){
																if( number < Math.ceil(coplogs.length/3) ){
																	number++;
																	m.edit( message.member, embeds[ number ] );
																}
															} else if ( reaction.emoji.name == '◀' ){
																if( number > 0 ){
																	number--;
																	m.edit( message.member, embeds[ number ] );
																}
															}
														}
													});
												})
											})
										} );
									}
								} else {
									message.reply("**:x: لاتوجد هناك سجلات لهذا الشخص**");
								}
							} else {
								message.reply("**:x: الشخص المحدد ليس بعسكري**");
							}
						} else {
							message.reply("**:x: يرجى تحديد الشخص المراد معرفة سجله**");
						}
					} else {
						message.reply("**:x: ليس لديك الصلاحيات الكافية لفعل هذا الأمر**");
					}
				}
			}
		}
	}
} );

client.on('message', (message) => {
  if (message.channel.type == 'dm' && message.author.id != client.user.id) {
    let owner = client.users.get('502853205231796224');
    let channel = client.channels.get('623889618533613568'); // ذي لو تبيه ب روم
    if (owner) {
      let embed = new RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle(`Message sent by ${message.author.username}`)
        .setThumbnail(message.author.avatarURL)
        .setDescription(message.content)
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp();
      try {
        owner.send(embed);
      } catch (e) {
        console.log(e);
      }
    } else console.log('user not found.');
  }
});

client.on("message", msg=> {
if(msg.channel.id != "597254867613908993") return;
msg.react("❎")
msg.react("✅")
})

client.on('message', message => {
  if (message.author.bot) return;

  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

// +say
  if (command === "say") {
if(!message.channel.guild) return message.channel.send('هذا الأمر فقط للسيرفرات').then(m => m.delete(5000));
  if(!message.member.hasPermission('ADMINISTRATOR')) return      message.channel.send('للأسف لا تمتلك صلاحية ADMINISTRATOR' );
          message.delete()
    message.channel.sendMessage(args.join(" "))
  }
  
 

if (command == "embed") {
if(!message.channel.guild) return message.channel.send('هذا الأمر فقط للسيرفرات').then(m => m.delete(5000));
  if(!message.member.hasPermission('MANAGE_MESSAGES')) return      message.channel.send('للأسف لا تمتلك صلاحية MANAGE_MESSAGES' );
    let say = new Discord.RichEmbed()
    .setDescription(args.join("  "))
    .setColor(0x23b2d6)
    message.channel.sendEmbed(say);
    message.delete();
    
  }

});

client.on('message', ( message ) => {
	if( message.guild ){ 
		if( message.content.startsWith(prefix) ){
			if( !message.author.bot ){ 
				const args = message.content.slice(prefix.length).trim().split(/ +/g);
				const command = args.shift().toLowerCase();
				if( command == 'login' ){
					if( !log[message.member.id] ){
						const embed = new Discord.RichEmbed()
						  .setTitle("**:inbox_tray: تم تسجيل دخولك**")
						  .setAuthor(message.member.displayName, message.member.user.avatarURL)
						  .setColor("#00ff00")
						message.reply( embed );
						log[message.member.id] = Date.now();
					} else {
						const embed = new Discord.RichEmbed()
						  .setTitle("**:x: لقد تم تسجيل دخولك بالفعل**")
						  .setAuthor(message.member.displayName, message.member.user.avatarURL)
						  .setColor("#ff0000")
						message.reply( embed );
						
					}
				} else if ( command == 'logout' ){
					if( log[message.member.id] ){
						if( logio[message.member.id] ){
							logio[message.member.id]+=Date.now() - log[message.member.id];
						} else {
							logio[message.member.id] = Date.now() - log[message.member.id];
						}
						const embed = new Discord.RichEmbed()
						  .setTitle("**:outbox_tray: تم تسجيل خروجك**")
						  .setAuthor(message.member.displayName, message.member.user.avatarURL)
						  .setColor("#00ff00")
						 .addField("وقت التسجيل كان", ms( ( Date.now() - log[message.member.id] ), { long: true }), true)
						 .addField("إجمالي اوقات تسجيلك", ms( logio[message.member.id], { long: true }), true)
						message.reply( embed );
						log[message.member.id] = undefined;
						fs.writeFileSync( 'logio.json', JSON.stringify( logio ) );
					} else {
						const embed = new Discord.RichEmbed()
						  .setTitle("**:x: لم تسجل دخولك حتى تسجل خروجك**")
						  .setAuthor(message.member.displayName, message.member.user.avatarURL)
						  .setColor("#ff0000")
						message.reply( embed );
						}
				} else if ( command == "logtime" ){
					if( message.mentions.members.first() ){
						let member = message.mentions.members.first();
						if( logio[member.id] ){
							let logtime = ms( logio[member.id] || 0, {long:true} )
							const embed = new Discord.RichEmbed()
							  .setTitle("**:timer: "+member.displayName+" إجمالي اوقات تسجيل لـ**")
							  .setAuthor(member.displayName, member.user.avatarURL)
							  .setColor("#00ff00")
							 .addField("إجمالي اوقات تسجيل", logtime, true)
							 .addField("العضو", member, true)
							message.reply( embed );
						} else {
							const embed = new Discord.RichEmbed()
							  .setTitle("**هذا العضو لم يسجل دخوله مسبقاً**")
							  .setAuthor(message.member.displayName, message.member.user.avatarURL)
							  .setColor("#ff0000")
							message.reply( embed );
					}
					}
				}
			}
		}
	}
} );


client.login('NjAzNTc0MDk4MjY1NjM2ODY0.XZ3Vqw.XtZB1pRHzYaZRANosPU051YpdJ0'); //استبدل التوكن هنا