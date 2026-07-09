import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const ALLOWED_USER_IDS = process.env.ALLOWED_USER_IDS
  ? new Set(process.env.ALLOWED_USER_IDS.split(",").map((id) => id.trim()))
  : null; // null = no restriction, everyone can use it

if (!BOT_TOKEN || !CLIENT_ID) {
  console.error("Missing BOT_TOKEN or CLIENT_ID environment variables.");
  process.exit(1);
}

// ─── Roasts ───────────────────────────────────────────────────────────────────

const roasts = [
  "Your hairline is so far back, NASA is using it to map the edge of the solar system.",
  "You look like you were drawn by someone who heard a person described once but never actually saw one.",
  "Your face looks like it fell asleep on a waffle iron and woke up optimistic.",
  "I've seen better-looking things crawl out of a storm drain after a flood.",
  "You're built like someone tried to describe a human to an AI using only complaints.",
  "You look like a before photo that never got an after.",
  "Your skin looks like it gets its moisture from spite and gas station hot dogs.",
  "You got a face that would make a blind man feel lucky.",
  "You look like you were assembled by someone who was definitely multitasking.",
  "Your forehead is so big it's got its own timezone.",
  "You look like the kind of person who gets mistaken for a cry for help.",
  "Your nose is so big it shows up on Google Maps before your house does.",
  "Your teeth look like they've been marinating in coffee, cigarettes, and bad decisions since 2009.",
  "You got a face only a mother could love — and even she looks a little unsure.",
  "You look like a man who's never won anything, not even an argument with himself.",
  "Your jawline is so weak it files for emotional support from your chin.",
  "Your underwear has more stains than a crime scene — forensics would need three teams just to categorize them.",
  "Your underwear is so crusty it could file for its own tax return.",
  "You smell like a gym bag that gave up on life.",
  "The only thing working harder than you is the deodorant you clearly forgot to put on.",
  "Your breath smells like you gargled with a used ashtray dipped in cat piss.",
  "Your hygiene makes me want to send a welfare check to your shower.",
  "You smell like regret and cheap body spray. Pick one or the other, my guy.",
  "Your socks have seen things. Terrible things. They're traumatized.",
  "There's a science experiment living in your belly button and it's applied for a grant.",
  "Your armpits smell like a deal between Satan and a wet dog.",
  "The inside of your car probably smells like the inside of your soul — musty and abandoned.",
  "You got dandruff so bad your shoulders look like a ski resort.",
  "You've got the energy of someone who peaked in middle school and is still recovering.",
  "I can tell you've been eating your feelings. Must be an all-you-can-eat buffet of self-loathing.",
  "Your posture is so bad your spine filed a restraining order against your brain.",
  "You're the human equivalent of a participation trophy.",
  "You look like you've never made a decision you didn't regret within 24 hours.",
  "Your personality has the same energy as a wet paper bag at a job interview.",
  "You've got the vibe of someone whose WiFi password is their own name spelled wrong.",
  "You look like the type to argue with a ChatGPT response you didn't like.",
  "You walk like you're carrying the weight of every bad decision you've ever made, and you've made a lot.",
  "You're the reason some parents second-guess having more kids.",
  "The last time someone looked at you like you were attractive, they were legally blind and it was dark.",
  "You got the confidence of someone who has never looked in a mirror and the results show.",
  "If being a disappointment were an Olympic sport, you'd still somehow finish fourth.",
  "You're so average that even your shadow gets bored following you around.",
  "Your energy is the human equivalent of buffering.",
  "You look like your Google search history is a cry for help.",
  "Your mom didn't raise a quitter, but honestly, quitting is something you'd actually be good at.",
  "Your vibe is 'I only showered because someone was coming over.'",
  "You look like you've never experienced something going right without a catch.",
  "You're living proof that the universe makes mistakes.",
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Commands ─────────────────────────────────────────────────────────────────

const commands = [
  {
    data: new SlashCommandBuilder()
      .setName("roast")
      .setDescription("Violate someone with a savage roast 🔥")
      .addUserOption((o) => o.setName("target").setDescription("Who's getting roasted?").setRequired(false)),
    async execute(interaction) {
      const target = interaction.options.getUser("target");
      const roast = randomFrom(roasts);
      await interaction.reply(target ? `${target} ${roast}` : roast);
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName("mock")
      .setDescription("SpOnGeBoB mocking text 🐔")
      .addStringOption((o) => o.setName("message").setDescription("Message to mock").setRequired(true))
      .addUserOption((o) => o.setName("target").setDescription("Tag someone").setRequired(false)),
    async execute(interaction) {
      const msg = interaction.options.getString("message", true);
      const target = interaction.options.getUser("target");
      const mocked = msg.split("").map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join("");
      await interaction.reply(target ? `${target} "${mocked}" 🐔` : `"${mocked}" 🐔`);
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName("iq")
      .setDescription("Scientifically measure someone's IQ 🧠")
      .addUserOption((o) => o.setName("target").setDescription("Who's getting tested?").setRequired(false)),
    async execute(interaction) {
      const target = interaction.options.getUser("target");
      const subject = target ? `<@${target.id}>` : `<@${interaction.user.id}>`;
      const iq = Math.floor(Math.random() * 160) + 1;
      const lowComments = [
        "— that's legally a vegetable.",
        "— plants score higher.",
        "— your wifi router is smarter.",
        "— a rock would outscore you on a good day.",
        "— scientists are baffled you can operate a fork.",
        "— your neurons gave up and filed for early retirement.",
        "— doctors recommend keeping you away from sharp objects.",
      ];
      const midComments = ["— aggressively mid.", "— peak 'C student' energy.", "— you tried.", "— technically not legally dumb, but we see you."];
      const highComments = ["— still lost to a pigeon in chess though.", "— used entirely to figure out how to open snacks quietly.", "— mostly wasted."];
      const comment = iq < 70 ? randomFrom(lowComments) : iq < 110 ? randomFrom(midComments) : randomFrom(highComments);
      await interaction.reply(`🧠 **IQ Test Results**\n${subject} scored **${iq}** ${comment}`);
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName("ratio")
      .setDescription("Ratio someone instantly 📉")
      .addUserOption((o) => o.setName("target").setDescription("Who's getting ratioed?").setRequired(false)),
    async execute(interaction) {
      const target = interaction.options.getUser("target");
      const lines = [
        "ratio + didn't ask + cope + L + stay mad + touch grass",
        "ratio + your opinion smells like your search history",
        "ratio + no one asked + L + W for everyone reading this",
        "ratio + you clearly typed this with your chin",
        "ratio + skill issue + get ratioed bestie 💀",
        "ratio + down bad + keep crying",
        "ratio + irrelevant + next",
        "ratio + L take + bad vibes + go outside",
      ];
      const line = randomFrom(lines);
      await interaction.reply(target ? `${target} ${line}` : line);
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName("simp")
      .setDescription("Run a simp detection scan 📡")
      .addUserOption((o) => o.setName("target").setDescription("Who's getting scanned?").setRequired(false)),
    async execute(interaction) {
      const target = interaction.options.getUser("target");
      const subject = target ? `<@${target.id}>` : `<@${interaction.user.id}>`;
      const pct = Math.floor(Math.random() * 101);
      const filled = Math.round(pct / 10);
      const bar = "█".repeat(filled) + "░".repeat(10 - filled);
      let label, verdict;
      if (pct >= 90) { label = "MAXIMUM SIMP 🚨"; verdict = "absolutely cooked. they don't even know your name."; }
      else if (pct >= 70) { label = "Certified Simp 😔"; verdict = "you write 'good morning' texts before the sun is up."; }
      else if (pct >= 50) { label = "Mid-Level Simp 🫠"; verdict = "you're one ignored message away from a breakdown."; }
      else if (pct >= 30) { label = "Subtle Simp 👀"; verdict = "you're not a simp, you just act like one constantly."; }
      else { label = "Barely Human 🧊"; verdict = "ice cold. probably too scared to talk to anyone anyway."; }
      await interaction.reply(`📡 **Simp Scan Results**\nSubject: ${subject}\n[${bar}] **${pct}%**\nStatus: **${label}**\nVerdict: *${verdict}*`);
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName("sus")
      .setDescription("File an official sus report 🔴")
      .addUserOption((o) => o.setName("target").setDescription("Who's acting sus?").setRequired(true)),
    async execute(interaction) {
      const target = interaction.options.getUser("target", true);
      const reasons = [
        "was seen leaving the vents at 3am.",
        "keeps whispering to themselves and calling it 'strategizing'.",
        "hasn't blinked since joining the call.",
        "voted to skip tasks and hasn't done a single one.",
        "their search history is a federal crime.",
        "was spotted standing motionless in electrical for 10 minutes.",
        "keeps asking where the body was like they already know.",
        "has been AFK for 20 minutes and came back acting normal.",
        "sabotaged the oxygen and blamed it on lag.",
        "called an emergency meeting with no evidence and a guilty face.",
        "keeps asking 'hypothetically, how do you get away with things.'",
      ];
      await interaction.reply(`🔴 **OFFICIAL SUS REPORT**\n**Suspect:** <@${target.id}>\n**Evidence:** ${randomFrom(reasons)}\n**Verdict:** Impostor. Vote them out immediately. Do not let them talk.`);
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName("clap")
      .setDescription("Add 👏 between 👏 every 👏 word")
      .addStringOption((o) => o.setName("message").setDescription("What to clap-ify").setRequired(true)),
    async execute(interaction) {
      const msg = interaction.options.getString("message", true);
      const clapped = msg.trim().split(/\s+/).join(" 👏 ");
      await interaction.reply(`👏 ${clapped} 👏`);
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName("reverse")
      .setDescription("Reverse text back at someone")
      .addStringOption((o) => o.setName("message").setDescription("Message to reverse").setRequired(true))
      .addUserOption((o) => o.setName("target").setDescription("Tag someone").setRequired(false)),
    async execute(interaction) {
      const msg = interaction.options.getString("message", true);
      const target = interaction.options.getUser("target");
      const reversed = msg.split("").reverse().join("");
      await interaction.reply(target ? `${target} "${reversed}"` : `"${reversed}"`);
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName("copium")
      .setDescription("Deliver copium to someone in need 💊")
      .addUserOption((o) => o.setName("target").setDescription("Who needs it?").setRequired(false)),
    async execute(interaction) {
      const target = interaction.options.getUser("target");
      const lines = [
        "take this copium and touch grass 🌿",
        "here's your copium prescription. take twice daily and get over it. 💊",
        "cope harder. maybe it'll work this time 🤡",
        "the copium is being delivered via helicopter as we speak 🚁",
        "here is your copium. it will not help. nothing will help. 🫡",
        "inhale the copium. exhale the excuses. 😤",
        "copium administered. still not good though 📋",
        "bag of copium. sealed. expires never because you'll always need it. 🎒",
      ];
      const line = randomFrom(lines);
      await interaction.reply(target ? `${target} ${line}` : line);
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Spam mention someone a brutal amount of times")
      .addUserOption((o) => o.setName("target").setDescription("Who's getting pinged?").setRequired(true))
      .addIntegerOption((o) =>
        o.setName("amount").setDescription("How many times? (1–1000)").setRequired(true).setMinValue(1).setMaxValue(1000)
      ),
    async execute(interaction) {
      const target = interaction.options.getUser("target", true);
      const amount = interaction.options.getInteger("amount", true);
      const mention = `<@${target.id}>`;

      const mentions = Array(amount).fill(mention);
      const chunks = [];
      let current = "";
      for (const m of mentions) {
        const next = current ? `${current} ${m}` : m;
        if (next.length > 1900) { chunks.push(current); current = m; }
        else { current = next; }
      }
      if (current) chunks.push(current);

      await interaction.reply(chunks[0]);
      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp(chunks[i]);
      }
    },
  },
];

// ─── Register commands + start bot ───────────────────────────────────────────

const commandMap = new Map(commands.map((c) => [c.data.name, c]));

const rest = new REST().setToken(BOT_TOKEN);

console.log("Registering slash commands...");
await rest.put(Routes.applicationCommands(CLIENT_ID), {
  body: commands.map((c) => c.data.toJSON()),
});
console.log(`Registered ${commands.length} commands.`);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Allowlist check
  if (ALLOWED_USER_IDS && !ALLOWED_USER_IDS.has(interaction.user.id)) {
    await interaction.reply({ content: "you're not allowed to use this bot lmaooo", ephemeral: true });
    return;
  }

  const cmd = commandMap.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error(`Error in /${interaction.commandName}:`, err);
    const msg = { content: "Something broke. Try again.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg);
    } else {
      await interaction.reply(msg);
    }
  }
});

await client.login(BOT_TOKEN);
