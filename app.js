const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const todayKey = new Date().toISOString().slice(0, 10);

const defaultState = {
  date: todayKey,
  streak: 0,
  lastCompletionDate: "",
  completedChecklist: {},
  skillProgress: {
    speaking: 0,
    listening: 0,
    reading: 0,
    writing: 0,
  },
  speakingSessions: [],
  writingSessions: [],
  dailyRecords: {},
  activityLog: [],
  roundHistory: [],
  answerStats: {
    speakingAnalyses: 0,
    speakingSaves: 0,
    phraseUpgrades: 0,
    dictations: 0,
    paraphrases: 0,
    readings: 0,
    writingAnalyses: 0,
    writingSaves: 0,
    rounds: 0,
  },
  lastActivityAt: "",
  calendarOpen: false,
  week: 1,
};

const dailyItems = [
  {
    id: "shadow",
    skill: "speaking",
    title: "Shadow 3 rounds",
    detail: "Shadow chunks while keeping linking and stress",
  },
  {
    id: "reflex",
    skill: "speaking",
    title: "Instant answers: 5 prompts",
    detail: "5 seconds to prepare, 20 seconds to answer",
  },
  {
    id: "longSentence",
    skill: "speaking",
    title: "Daily complex sentence memorization",
    detail: "Listen twice, split into 3 chunks, retell once",
  },
  {
    id: "dictation",
    skill: "listening",
    title: "Dictation: 1 sentence",
    detail: "Listen for chunks, then check paraphrases",
  },
  {
    id: "reading",
    skill: "reading",
    title: "Reading location: 1 passage",
    detail: "Read questions first, then locate evidence",
  },
  {
    id: "writing",
    skill: "writing",
    title: "Task 2: develop 1 paragraph",
    detail: "Position, reason, example, link back",
  },
];

const chunkGroups = [
  [
    ["To be honest", "Natural opener for a real attitude"],
    ["It depends on the situation", "Adds flexibility to Part 3 answers"],
    ["What I mean is", "Useful for clarifying without sounding repetitive"],
  ],
  [
    ["I'm leaning towards...", "A natural way to express preference"],
    ["A good example would be...", "A smooth way to introduce an example"],
    ["That being said", "A natural contrast marker"],
  ],
  [
    ["I wouldn't say it's always true", "Soft disagreement"],
    ["It has a lot to do with...", "Natural reason-giving phrase"],
    ["In my case", "Quickly adds a personal detail"],
  ],
  [
    ["The way I see it", "Part 3 opinion opener"],
    ["It's not just about...", "Adds a second layer to your idea"],
    ["That's probably why", "Cause-effect wrap-up"],
  ],
];

const speakingPrompts = [
  {
    type: "IELTS Speaking Part 1",
    text: "What kind of work would you like to do in the future?",
  },
  {
    type: "IELTS Speaking Part 1",
    text: "Do you prefer studying alone or with other people?",
  },
  {
    type: "IELTS Speaking Part 2",
    text: "Describe a person who speaks a foreign language well. You should say who this person is, how they learned it, and why you admire them.",
  },
  {
    type: "IELTS Speaking Part 2",
    text: "Describe a time when you had to learn something quickly.",
  },
  {
    type: "IELTS Speaking Part 3",
    text: "Why do some adults find it difficult to speak a foreign language fluently?",
  },
  {
    type: "IELTS Speaking Part 3",
    text: "Do you think technology can replace real conversation practice?",
  },
  {
    type: "Natural response",
    text: "Someone asks why your opinion changed recently. Answer naturally, with one concrete detail.",
  },
  {
    type: "Natural response",
    text: "Someone disagrees with your plan. Respond politely and keep the conversation moving.",
  },
];

const shadowLines = [
  {
    line: "To be honest, I used to find it quite challenging, but now it feels a lot more manageable.",
    note: "Weak forms: connect used to / find it / a lot more.",
  },
  {
    line: "I wouldn't say it's perfect, but it's definitely moving in the right direction.",
    note: "Stress perfect / definitely / right direction.",
  },
  {
    line: "What I mean is, it works well when people have a clear reason to keep going.",
    note: "Pause lightly after What I mean is, then say the second half smoothly.",
  },
  {
    line: "In my case, the biggest change came from speaking a little bit every single day.",
    note: "Put information stress on biggest change / speaking / every single day.",
  },
  {
    line: "That being said, face-to-face practice still gives you something an app can't fully replace.",
    note: "Keep that being said light and connected; do not stress every word.",
  },
];

const longSentences = [
  {
    sentence:
      "Although technology has made language learning more accessible than ever before, real fluency still depends on repeated, meaningful interaction rather than passive exposure to information.",
    meaning:
      "Technology can make language learning easier to access, but fluency still comes from repeated, meaningful interaction rather than passive exposure.",
    chunks: [
      "Although technology has made language learning more accessible than ever before",
      "real fluency still depends on repeated, meaningful interaction",
      "rather than passive exposure to information",
    ],
    focus: "Concession clause + depends on + rather than; useful for Part 3 and writing.",
  },
  {
    sentence:
      "What distinguishes confident speakers from hesitant learners is not the absence of mistakes, but the ability to repair a sentence naturally and keep the conversation moving.",
    meaning:
      "Confident speakers are not mistake-free; they can repair sentences naturally and keep the conversation moving.",
    chunks: [
      "What distinguishes confident speakers from hesitant learners",
      "is not the absence of mistakes",
      "but the ability to repair a sentence naturally and keep the conversation moving",
    ],
    focus: "What-clause as subject; useful for explaining the real difference.",
  },
  {
    sentence:
      "If students rely entirely on memorized phrases, their answers may sound fluent at first, but they often struggle when the examiner asks a follow-up question.",
    meaning:
      "Memorized phrases may sound fluent at first, but follow-up questions often expose weak flexibility.",
    chunks: [
      "If students rely entirely on memorized phrases",
      "their answers may sound fluent at first",
      "but they often struggle when the examiner asks a follow-up question",
    ],
    focus: "Conditional sentence + contrast; useful for talking about learning methods and natural speaking.",
  },
  {
    sentence:
      "The more deliberately you notice how native speakers connect ideas, soften opinions and give examples, the easier it becomes to produce natural responses under pressure.",
    meaning:
      "The more deliberately you notice how native speakers link ideas, soften opinions and give examples, the easier it becomes to produce natural responses under pressure.",
    chunks: [
      "The more deliberately you notice how native speakers connect ideas",
      "soften opinions and give examples",
      "the easier it becomes to produce natural responses under pressure",
    ],
    focus: "The more..., the easier... structure; useful for explaining training patterns.",
  },
  {
    sentence:
      "A high-level IELTS answer is usually not one that contains the rarest words, but one that develops a clear idea with accurate vocabulary and controlled grammar.",
    meaning:
      "A high-scoring answer is not about rare words; it develops a clear idea with accurate vocabulary and controlled grammar.",
    chunks: [
      "A high-level IELTS answer is usually not one that contains the rarest words",
      "but one that develops a clear idea",
      "with accurate vocabulary and controlled grammar",
    ],
    focus: "not..., but... is a high-scoring contrast structure.",
  },
];

const reflexPrompts = [
  {
    mode: "Soft disagreement",
    prompt: "Someone says online courses are always better than classroom learning.",
    model:
      "I wouldn't say they're always better. Online courses are convenient, but in a classroom you get pressure, feedback, and real interaction, which can make a big difference.",
  },
  {
    mode: "Expressing a real preference",
    prompt: "A friend asks whether you prefer a stable job or a creative job.",
    model:
      "I'm leaning towards a creative job, mainly because I enjoy solving problems in different ways. Stability matters, of course, but I don't want every day to feel exactly the same.",
  },
  {
    mode: "Acknowledging complexity",
    prompt: "Someone asks if children should use tablets in school.",
    model:
      "It depends on how they're used. Tablets can make lessons more interactive, but if there are no clear rules, they can easily become a distraction.",
  },
  {
    mode: "Giving a personal example",
    prompt: "Explain why speaking practice matters more than memorizing vocabulary lists.",
    model:
      "In my case, I remembered words much better after using them in real conversations. A word becomes active when you connect it with a situation, not just a translation.",
  },
  {
    mode: "Natural contrast",
    prompt: "You like living in a big city, but you also see its downsides.",
    model:
      "I do enjoy the energy of a big city. That being said, the noise and commuting can be exhausting, especially when you need a quiet place to focus.",
  },
];

const phraseBank = [
  {
    stiff: "I think it is very important because it can help people improve themselves.",
    natural:
      "I think it matters a lot because it helps people become better at what they actually do every day.",
    tip: "Replace very important with matters a lot, and make improve themselves more specific.",
  },
  {
    stiff: "There are many advantages and disadvantages in this issue.",
    natural:
      "There are clear benefits, but it also depends on how people use it.",
    tip: "Avoid template language in speaking; use benefits + depends on directly.",
  },
  {
    stiff: "I agree with this opinion to a large extent.",
    natural:
      "I mostly agree with that, although I wouldn't apply it to every situation.",
    tip: "mostly agree sounds more natural and leaves room for nuance.",
  },
  {
    stiff: "This phenomenon is becoming increasingly common in modern society.",
    natural:
      "You see this a lot more nowadays, especially in bigger cities.",
    tip: "phenomenon / modern society sounds too essay-like; use see this a lot more.",
  },
  {
    stiff: "It can bring people a lot of convenience.",
    natural:
      "It makes daily life a lot easier, especially when people are busy.",
    tip: "convenience sounds noun-heavy; makes life easier is more natural in speech.",
  },
];

const dictations = [
  {
    topic: "Campus life",
    text: "The library has extended its opening hours during the exam period.",
    chunks: ["The library has extended", "its opening hours", "during the exam period"],
    focus: "extended its opening hours = made the opening time longer",
  },
  {
    topic: "Workplace",
    text: "Flexible working arrangements can improve productivity if the team communicates clearly.",
    chunks: ["Flexible working arrangements", "can improve productivity", "if the team communicates clearly"],
    focus: "arrangements / productivity are high-frequency workplace terms.",
  },
  {
    topic: "Travel",
    text: "The guided tour includes transport, entrance tickets, and a short lunch break.",
    chunks: ["The guided tour includes", "transport, entrance tickets", "and a short lunch break"],
    focus: "includes is often followed by a list of items.",
  },
  {
    topic: "Education",
    text: "Students often learn faster when they receive immediate feedback on their mistakes.",
    chunks: ["Students often learn faster", "when they receive immediate feedback", "on their mistakes"],
    focus: "receive immediate feedback = get comments right away.",
  },
  {
    topic: "Environment",
    text: "The council plans to introduce stricter recycling rules in residential areas next month.",
    chunks: ["The council plans to introduce", "stricter recycling rules", "in residential areas next month"],
    focus: "council / stricter rules / residential areas are common Section 2 expressions.",
  },
  {
    topic: "Health",
    text: "Regular exercise is more effective when it is combined with a realistic diet plan.",
    chunks: ["Regular exercise is more effective", "when it is combined with", "a realistic diet plan"],
    focus: "be combined with = used together with something.",
  },
  {
    topic: "Technology",
    text: "The new app allows users to compare prices before making a final purchase.",
    chunks: ["The new app allows users", "to compare prices", "before making a final purchase"],
    focus: "compare prices / final purchase are common shopping and technology collocations.",
  },
  {
    topic: "Housing",
    text: "The rent includes electricity and internet access, but tenants must pay for water separately.",
    chunks: ["The rent includes electricity", "and internet access", "but tenants must pay for water separately"],
    focus: "rent / tenants / separately are common rental-listening words.",
  },
  {
    topic: "Research",
    text: "Participants were asked to complete a short questionnaire before the interview began.",
    chunks: ["Participants were asked", "to complete a short questionnaire", "before the interview began"],
    focus: "participants / questionnaire / interview are common academic-listening terms.",
  },
  {
    topic: "Transport",
    text: "Passengers should check the revised timetable because several morning trains have been cancelled.",
    chunks: ["Passengers should check", "the revised timetable", "because several morning trains have been cancelled"],
    focus: "revised timetable = updated schedule.",
  },
];

const paraphrases = [
  {
    source: "cheap",
    answer: "affordable",
    options: ["temporary", "affordable", "crowded", "optional"],
  },
  {
    source: "delay",
    answer: "postpone",
    options: ["postpone", "reserve", "reduce", "repair"],
  },
  {
    source: "important",
    answer: "significant",
    options: ["accurate", "significant", "ordinary", "limited"],
  },
  {
    source: "book a place",
    answer: "reserve a seat",
    options: ["take a break", "reserve a seat", "change a route", "lose a ticket"],
  },
  {
    source: "helpful",
    answer: "beneficial",
    options: ["beneficial", "expensive", "distant", "temporary"],
  },
  {
    source: "rules",
    answer: "regulations",
    options: ["regulations", "locations", "resources", "materials"],
  },
  {
    source: "start",
    answer: "introduce",
    options: ["reduce", "introduce", "borrow", "avoid"],
  },
  {
    source: "enough",
    answer: "sufficient",
    options: ["sufficient", "separate", "similar", "serious"],
  },
  {
    source: "before",
    answer: "prior to",
    options: ["due to", "prior to", "close to", "thanks to"],
  },
  {
    source: "mainly",
    answer: "primarily",
    options: ["rarely", "primarily", "roughly", "recently"],
  },
  {
    source: "change",
    answer: "modify",
    options: ["modify", "monitor", "mention", "measure"],
  },
];

const passages = [
  {
    level: "IELTS 7.5 style",
    title: "The Hidden Cost Of Efficiency",
    text:
      "In many industries, efficiency is treated as an unquestioned good. A factory that produces more units with fewer workers, a hospital that reduces the average time spent with each patient, or a school that standardizes assessment across hundreds of classrooms may all appear to be improving. Yet the pursuit of efficiency can create losses that are difficult to measure. When employees are given no time to exchange informal knowledge, small problems may remain invisible until they become expensive failures. When public services are designed around speed, the people with the most complex needs may receive the least useful support. This does not mean that efficiency should be rejected. Wasteful systems can be unfair, especially when public money is involved. The problem arises when a single measure, such as cost per user or minutes per task, becomes a substitute for judgment. A more mature approach would ask not only whether a process is faster, but what kind of value is being protected, reduced or displaced.",
    questions: [
      {
        q: "The writer suggests that efficiency is often seen as",
        options: ["a value that needs no defence", "a threat to every public service", "a concept used only in factories"],
        answer: 0,
        evidence: "Efficiency is treated as an unquestioned good.",
      },
      {
        q: "What may happen when workers cannot exchange informal knowledge?",
        options: ["Assessment becomes easier", "Small problems may go unnoticed", "Factories immediately become safer"],
        answer: 1,
        evidence: "Small problems may remain invisible until they become expensive failures.",
      },
      {
        q: "In public services, speed may disadvantage people who",
        options: ["have complex needs", "pay higher taxes", "avoid standardized forms"],
        answer: 0,
        evidence: "People with the most complex needs may receive the least useful support.",
      },
      {
        q: "The writer's attitude to efficiency is best described as",
        options: ["completely negative", "carefully qualified", "uncritically supportive"],
        answer: 1,
        evidence: "Efficiency should not be rejected, but a single measure should not replace judgment.",
      },
      {
        q: "The phrase 'displaced' in the final sentence is closest in meaning to",
        options: ["moved aside", "clearly explained", "financially rewarded"],
        answer: 0,
        evidence: "The sentence asks what value is protected, reduced or displaced.",
      },
    ],
  },
  {
    level: "IELTS 7.5 style",
    title: "When Preservation Becomes Reinvention",
    text:
      "Historic buildings are often protected because they appear to offer a stable connection with the past. However, preservation is rarely as simple as freezing a structure in its original state. Materials decay, safety regulations change, and the social function of a building may disappear. A former warehouse, for instance, may survive only because it is converted into apartments or studios. Critics sometimes argue that such conversions produce an artificial version of history, one that keeps brick walls and decorative features while removing the economic reality that created them. Yet an unused building can also become a monument to neglect. The most convincing preservation projects tend to acknowledge change rather than conceal it. They allow a building to serve contemporary needs while making visible the traces of earlier use. In this sense, preservation is not the opposite of reinvention. It is a negotiation between memory, utility and the practical conditions that allow a place to remain part of public life.",
    questions: [
      {
        q: "Why is preservation rarely simple?",
        options: ["Buildings are always privately owned", "Physical and social conditions change", "People dislike old materials"],
        answer: 1,
        evidence: "Materials decay, safety regulations change, and social function may disappear.",
      },
      {
        q: "What criticism is made of some conversions?",
        options: ["They create an artificial version of history", "They make buildings impossible to use", "They remove every old feature"],
        answer: 0,
        evidence: "Critics say conversions produce an artificial version of history.",
      },
      {
        q: "The writer implies that an unused historic building may",
        options: ["still be a preservation success", "represent neglect rather than respect", "require no maintenance"],
        answer: 1,
        evidence: "An unused building can become a monument to neglect.",
      },
      {
        q: "The best preservation projects are said to",
        options: ["hide all modern changes", "acknowledge change", "restore the original economy"],
        answer: 1,
        evidence: "They acknowledge change rather than conceal it.",
      },
      {
        q: "The main purpose of the passage is to",
        options: ["argue that preservation involves adaptation", "criticize all urban development", "compare warehouses with museums"],
        answer: 0,
        evidence: "Preservation is described as a negotiation between memory, utility and practical conditions.",
      },
    ],
  },
  {
    level: "IELTS 7.5 style",
    title: "The Limits Of Data In Education",
    text:
      "Schools increasingly collect data on attendance, test performance, homework completion and even student behaviour. Used carefully, such information can reveal patterns that teachers might otherwise miss. A sudden decline in attendance, for example, may indicate that a student needs support before academic results begin to fall. However, data can also narrow the way learning is understood. The qualities that make a student intellectually curious, resilient or imaginative are not always easy to count. If schools reward only what can be measured, teachers may feel pressured to focus on short-term performance rather than deeper development. There is also a risk that data becomes descriptive rather than diagnostic: it may show that a student is behind without explaining why. The challenge is therefore not to choose between data and professional judgment, but to combine them intelligently. Numbers can start a conversation, but they should not be allowed to end it.",
    questions: [
      {
        q: "According to the passage, school data can help teachers",
        options: ["notice hidden patterns", "replace classroom observation", "avoid giving feedback"],
        answer: 0,
        evidence: "Information can reveal patterns teachers might otherwise miss.",
      },
      {
        q: "What may data fail to capture?",
        options: ["Attendance and homework", "Curiosity and imagination", "Test scores"],
        answer: 1,
        evidence: "Curiosity, resilience and imagination are not always easy to count.",
      },
      {
        q: "If only measurable outcomes are rewarded, teachers may focus on",
        options: ["long-term development", "short-term performance", "student creativity"],
        answer: 1,
        evidence: "Teachers may focus on short-term performance rather than deeper development.",
      },
      {
        q: "What is meant by data becoming 'descriptive rather than diagnostic'?",
        options: ["It shows a problem but not its cause", "It gives too many causes", "It makes learning impossible to measure"],
        answer: 0,
        evidence: "It may show a student is behind without explaining why.",
      },
      {
        q: "The final sentence suggests that numbers should",
        options: ["begin discussion, not replace judgment", "be removed from education", "decide all teaching methods"],
        answer: 0,
        evidence: "Numbers can start a conversation, but should not end it.",
      },
    ],
  },
  {
    level: "IELTS 8 style",
    title: "The Ecology Of Attention",
    text:
      "Attention is often discussed as though it were a purely individual resource: something each person must manage through discipline, self-control and better habits. This view is only partly convincing. The environments in which people work, study and socialize are increasingly designed to capture attention before it can be deliberately directed. Notifications, infinite feeds and algorithmic recommendations do not merely distract people; they alter expectations about how quickly stimulation should arrive. Over time, sustained attention may begin to feel unusually effortful, not because individuals have become weak, but because their surroundings have trained them to expect interruption. Some commentators therefore describe attention as an ecological issue. Just as clean air depends on shared regulation rather than private effort alone, a healthier attentional environment may require design standards, institutional rules and cultural restraint. Personal discipline still matters, but it is unlikely to succeed if every surrounding system profits from its failure.",
    questions: [
      {
        q: "The writer criticizes the view that attention is",
        options: ["only a matter of individual discipline", "impossible to influence", "unrelated to technology"],
        answer: 0,
        evidence: "Attention is often treated as individual self-control, but this is only partly convincing.",
      },
      {
        q: "Digital systems affect attention by changing people's expectations about",
        options: ["how fast stimulation should arrive", "how much sleep they need", "which subjects are valuable"],
        answer: 0,
        evidence: "They alter expectations about how quickly stimulation should arrive.",
      },
      {
        q: "Why might sustained attention feel difficult?",
        options: ["People have been trained to expect interruption", "Reading has become unnecessary", "Institutions ban concentration"],
        answer: 0,
        evidence: "Surroundings have trained people to expect interruption.",
      },
      {
        q: "The comparison with clean air is used to show that attention",
        options: ["may require shared rules", "is mainly a medical problem", "cannot be protected"],
        answer: 0,
        evidence: "Clean air depends on shared regulation, and attention may need standards and rules.",
      },
      {
        q: "The writer's conclusion is that personal discipline",
        options: ["matters but is not enough", "has no role at all", "always defeats digital design"],
        answer: 0,
        evidence: "Personal discipline still matters, but is unlikely to succeed alone.",
      },
    ],
  },
  {
    level: "IELTS 7.5 style",
    title: "Why Expertise Can Be Hard To Recognise",
    text:
      "In public debates, expertise is often valued only after a visible crisis has occurred. Before that point, expert work can appear cautious, slow or unnecessarily complicated. This is because much expertise consists not of dramatic action, but of preventing errors that would otherwise become visible. A bridge engineer may spend weeks questioning a design detail that most people will never notice; a public health researcher may recommend modest behavioural changes long before hospitals are under pressure. When such advice succeeds, the outcome can look uneventful, which makes the expert contribution easy to underestimate. The problem is intensified by communication. Specialists may use careful language because evidence is incomplete, while audiences may mistake caution for uncertainty or weakness. A better public understanding of expertise would recognize that responsible knowledge often speaks in probabilities, not slogans, and that prevention is difficult to celebrate precisely because it avoids the disaster that would have proved its value.",
    questions: [
      {
        q: "Expertise may be undervalued before a crisis because it often",
        options: ["prevents visible problems", "requires no evidence", "uses dramatic action"],
        answer: 0,
        evidence: "Expert work prevents errors that would otherwise become visible.",
      },
      {
        q: "The bridge engineer example illustrates work that",
        options: ["most people may not notice", "is mainly artistic", "has no practical consequence"],
        answer: 0,
        evidence: "A design detail most people will never notice.",
      },
      {
        q: "Successful prevention can seem",
        options: ["uneventful", "highly dramatic", "immediately profitable"],
        answer: 0,
        evidence: "When advice succeeds, the outcome can look uneventful.",
      },
      {
        q: "Why can specialist communication be misunderstood?",
        options: ["Careful language may be seen as weakness", "Experts never explain evidence", "Audiences prefer long reports"],
        answer: 0,
        evidence: "Audiences may mistake caution for uncertainty or weakness.",
      },
      {
        q: "The passage argues that responsible knowledge often uses",
        options: ["probabilities", "slogans", "guarantees"],
        answer: 0,
        evidence: "Responsible knowledge often speaks in probabilities, not slogans.",
      },
    ],
  },
  {
    title: "Urban Green Corridors",
    text:
      "Many cities are redesigning unused railway lines and narrow strips of land as green corridors. These spaces are not simply decorative. They can reduce heat, support small wildlife, and give residents a safer route for walking or cycling. However, their success depends on maintenance and local access. A corridor that looks attractive on a map may have little value if entrances are far apart or if lighting makes people feel unsafe after sunset. In several European cities, planners now involve local residents before construction begins, because everyday users often notice problems that technical surveys miss.",
    questions: [
      {
        q: "What is one function of green corridors besides decoration?",
        options: ["Increasing car traffic", "Reducing urban heat", "Replacing all parks"],
        answer: 1,
        evidence: "They can reduce heat and support small wildlife.",
      },
      {
        q: "Why might a corridor fail even if it looks good in a plan?",
        options: ["It may lack convenient access", "It may contain too many trees", "It may be too close to schools"],
        answer: 0,
        evidence: "Entrances may be far apart or lighting may feel unsafe.",
      },
      {
        q: "Why are residents involved before construction?",
        options: ["They can fund the project", "They notice practical problems", "They replace technical surveys"],
        answer: 1,
        evidence: "Everyday users often notice problems that surveys miss.",
      },
    ],
  },
  {
    title: "Language Learning And Confidence",
    text:
      "Fluency is often misunderstood as speaking quickly without mistakes. In reality, confident speakers use pauses, repair their sentences, and choose simpler words when necessary. What separates them from hesitant learners is not a perfect vocabulary, but the ability to keep meaning moving. Teachers who focus only on error correction may reduce risk-taking, while teachers who create short, frequent speaking tasks can help learners build automatic responses. Over time, these repeated responses become a base that supports more complex language.",
    questions: [
      {
        q: "What does the passage say fluent speakers can do?",
        options: ["Avoid all pauses", "Repair sentences naturally", "Use only complex vocabulary"],
        answer: 1,
        evidence: "They use pauses and repair their sentences.",
      },
      {
        q: "What may reduce risk-taking?",
        options: ["Only correcting errors", "Short speaking tasks", "Simple vocabulary"],
        answer: 0,
        evidence: "Teachers who focus only on error correction may reduce risk-taking.",
      },
      {
        q: "What do repeated responses support over time?",
        options: ["More complex language", "Silent reading speed", "Perfect grammar"],
        answer: 0,
        evidence: "They become a base for more complex language.",
      },
    ],
  },
  {
    title: "The Value Of Sleep Research",
    text:
      "Sleep research has moved beyond the simple idea that rest is a passive state. During sleep, the brain sorts information, strengthens useful memories, and removes some mental clutter. This may explain why people often solve difficult problems after taking a break rather than after working continuously. However, researchers warn that sleep quality is just as important as sleep duration. A person who spends eight hours in bed but wakes up repeatedly may receive fewer benefits than someone who sleeps for a shorter but more stable period.",
    questions: [
      {
        q: "What does the brain do during sleep?",
        options: ["Stops processing information", "Strengthens useful memories", "Avoids all mental activity"],
        answer: 1,
        evidence: "The brain sorts information and strengthens useful memories.",
      },
      {
        q: "Why can a break help with difficult problems?",
        options: ["It allows memory processing", "It removes the need for practice", "It increases working hours"],
        answer: 0,
        evidence: "People often solve problems after taking a break.",
      },
      {
        q: "What do researchers say is also important?",
        options: ["Sleep quality", "Expensive beds", "Late-night study"],
        answer: 0,
        evidence: "Sleep quality is just as important as sleep duration.",
      },
      {
        q: "Who may receive fewer sleep benefits?",
        options: ["Someone who sleeps in one stable block", "Someone who wakes up repeatedly", "Someone who sleeps before midnight"],
        answer: 1,
        evidence: "Repeated waking can reduce the benefits of sleep.",
      },
    ],
  },
  {
    title: "Digital Payments And Small Businesses",
    text:
      "Digital payment systems have allowed many small businesses to serve customers more efficiently. They reduce the need to handle cash and make it easier to track sales. Yet the shift is not equally positive for every business. Some older customers still prefer cash, and small shops may pay transaction fees that reduce their profit. For this reason, business owners often keep both options available. The most successful shops are not those that follow technology blindly, but those that choose tools that match their customers' habits.",
    questions: [
      {
        q: "What is one benefit of digital payment systems?",
        options: ["They remove all business costs", "They make sales easier to track", "They stop customers using cash"],
        answer: 1,
        evidence: "They make it easier to track sales.",
      },
      {
        q: "Why may some shops dislike digital payments?",
        options: ["They can involve transaction fees", "They attract too many young people", "They require more cash"],
        answer: 0,
        evidence: "Transaction fees can reduce profit.",
      },
      {
        q: "What do many owners keep available?",
        options: ["Only digital payment", "Both cash and digital options", "A single online store"],
        answer: 1,
        evidence: "Business owners often keep both options available.",
      },
      {
        q: "What makes a shop successful according to the text?",
        options: ["Using every new technology", "Matching tools to customers' habits", "Avoiding technology completely"],
        answer: 1,
        evidence: "They choose tools that match their customers' habits.",
      },
    ],
  },
  {
    title: "Museum Design For Younger Visitors",
    text:
      "Museums are increasingly designing exhibitions that encourage younger visitors to interact with objects, sounds, and stories. This does not mean that traditional displays are disappearing. Instead, curators are trying to create several levels of access. A child may first notice a moving image or a sound effect, while an adult may read a detailed explanation beside the same exhibit. The challenge is balance: too much technology can distract from the original object, while too little interaction may make the visit feel remote and lifeless.",
    questions: [
      {
        q: "What are museums trying to encourage?",
        options: ["Interaction with exhibits", "Shorter opening hours", "Fewer family visits"],
        answer: 0,
        evidence: "Exhibitions encourage visitors to interact with objects, sounds, and stories.",
      },
      {
        q: "Are traditional displays disappearing?",
        options: ["Yes, completely", "No, they still remain", "Only in small museums"],
        answer: 1,
        evidence: "Traditional displays are not disappearing.",
      },
      {
        q: "What may adults prefer near an exhibit?",
        options: ["A detailed explanation", "A moving image only", "A ticket machine"],
        answer: 0,
        evidence: "Adults may read a detailed explanation beside the same exhibit.",
      },
      {
        q: "What can too much technology do?",
        options: ["Distract from the original object", "Improve every display", "Remove all explanations"],
        answer: 0,
        evidence: "Too much technology can distract from the original object.",
      },
    ],
  },
  {
    title: "Remote Work And City Centres",
    text:
      "The growth of remote work has changed the rhythm of many city centres. Cafes that once depended on office workers now see fewer customers on Mondays and Fridays, while suburban areas have gained more daytime activity. Some city planners see this as a chance to redesign central districts so that they are not used only for office work. Housing, leisure facilities, and cultural spaces may become more important. Still, a complete shift is unlikely, because many companies continue to value face-to-face meetings for training and teamwork.",
    questions: [
      {
        q: "Which businesses have been affected by remote work?",
        options: ["Cafes near offices", "All suburban schools", "Airports only"],
        answer: 0,
        evidence: "Cafes that depended on office workers see fewer customers.",
      },
      {
        q: "What has happened in suburban areas?",
        options: ["More daytime activity", "Less internet access", "Fewer residents"],
        answer: 0,
        evidence: "Suburban areas have gained more daytime activity.",
      },
      {
        q: "What may city centres include more of?",
        options: ["Only parking spaces", "Housing and cultural spaces", "Fewer public services"],
        answer: 1,
        evidence: "Housing, leisure facilities, and cultural spaces may become more important.",
      },
      {
        q: "Why is a complete shift unlikely?",
        options: ["Companies still value face-to-face meetings", "Remote work is illegal", "Workers dislike flexibility"],
        answer: 0,
        evidence: "Companies value face-to-face meetings for training and teamwork.",
      },
    ],
  },
  {
    title: "Why Public Spaces Matter",
    text:
      "Public spaces such as parks, squares, and libraries play a role that is difficult to measure only in economic terms. They give people places to meet without spending much money and can reduce the sense of isolation in large cities. Good public spaces are not always expensive. Shade, seating, safety, and easy access often matter more than dramatic architecture. When these basic features are missing, a space may look impressive in photographs but remain empty in daily life.",
    questions: [
      {
        q: "What can public spaces reduce?",
        options: ["The sense of isolation", "The need for libraries", "All economic activity"],
        answer: 0,
        evidence: "They can reduce the sense of isolation in large cities.",
      },
      {
        q: "What does the text say about cost?",
        options: ["Good public spaces are always expensive", "They are not always expensive", "Only private spaces are affordable"],
        answer: 1,
        evidence: "Good public spaces are not always expensive.",
      },
      {
        q: "Which features often matter more than dramatic architecture?",
        options: ["Shade, seating, safety, and access", "Advertising and lighting only", "Large statues"],
        answer: 0,
        evidence: "Shade, seating, safety, and easy access often matter more.",
      },
      {
        q: "What may happen if basic features are missing?",
        options: ["The space may remain empty", "The space becomes safer", "More people take photos daily"],
        answer: 0,
        evidence: "It may look impressive in photographs but remain empty.",
      },
    ],
  },
  {
    title: "The Problem With Choice",
    text:
      "Consumers often assume that more choice is always better, but research suggests that too many options can make decisions harder. When people compare a large number of similar products, they may become less satisfied with the final choice because they keep wondering whether another option was better. Some companies have responded by simplifying their product ranges. This can make shopping faster and reduce anxiety, but it also requires careful design, because customers still want to feel that their needs are being recognized.",
    questions: [
      {
        q: "What can too many options do?",
        options: ["Make decisions harder", "Remove customer anxiety", "Guarantee satisfaction"],
        answer: 0,
        evidence: "Too many options can make decisions harder.",
      },
      {
        q: "Why may people feel less satisfied?",
        options: ["They wonder if another option was better", "They forget the price", "They dislike all products"],
        answer: 0,
        evidence: "They keep wondering whether another option was better.",
      },
      {
        q: "How have some companies responded?",
        options: ["By simplifying product ranges", "By removing customer service", "By increasing every price"],
        answer: 0,
        evidence: "Some companies simplify their product ranges.",
      },
      {
        q: "What do customers still want to feel?",
        options: ["Their needs are recognized", "They have no choices", "Shopping takes longer"],
        answer: 0,
        evidence: "Customers want to feel that their needs are being recognized.",
      },
    ],
  },
  {
    title: "Learning From Failed Projects",
    text:
      "Organizations often celebrate successful projects but pay less attention to failed ones. This is a missed opportunity. A failed project can reveal weak communication, unrealistic deadlines, or assumptions that were never tested. The difficulty is cultural: employees may hide mistakes if they fear blame. Some managers now hold review meetings that focus on decisions rather than individuals. When failure is examined carefully, it can become a source of practical knowledge rather than a reason for embarrassment.",
    questions: [
      {
        q: "What do organizations often pay less attention to?",
        options: ["Successful projects", "Failed projects", "New employees"],
        answer: 1,
        evidence: "They pay less attention to failed projects.",
      },
      {
        q: "What can a failed project reveal?",
        options: ["Weak communication", "Perfect planning", "Higher profits"],
        answer: 0,
        evidence: "It can reveal weak communication and unrealistic deadlines.",
      },
      {
        q: "Why might employees hide mistakes?",
        options: ["They fear blame", "They want review meetings", "They prefer teamwork"],
        answer: 0,
        evidence: "Employees may hide mistakes if they fear blame.",
      },
      {
        q: "What do some review meetings focus on?",
        options: ["Decisions rather than individuals", "Personal criticism", "Only financial rewards"],
        answer: 0,
        evidence: "Review meetings focus on decisions rather than individuals.",
      },
    ],
  },
];

const writingPrompts = [
  {
    prompt:
      "Some people believe that children should start learning a foreign language at primary school. To what extent do you agree or disagree?",
    position: "Mostly agree, with limits on pressure and teaching style.",
    plan:
      "Para 1: early exposure builds pronunciation and confidence. Para 2: lessons must be playful, not exam-driven.",
    usefulLanguage: ["early exposure", "age-appropriate instruction", "long-term communicative confidence"],
    model:
      "I largely agree that children should begin learning a foreign language at primary school, provided that the teaching is age-appropriate. At this stage, children are usually more willing to imitate sounds and take risks, which can help them develop clearer pronunciation and greater confidence. Early exposure also makes a second language feel less like an academic subject and more like a normal part of communication.\n\nHowever, this does not mean that young learners should be pushed into grammar-heavy lessons or frequent tests. If language classes become another source of pressure, the benefit may be lost. A better approach would be to use songs, stories, games and simple conversations, so that children build familiarity before accuracy. In this sense, early language learning is valuable not because it produces fluent speakers immediately, but because it creates a foundation for later progress.",
  },
  {
    prompt:
      "Many people work from home using digital technology. Do the advantages outweigh the disadvantages?",
    position: "Advantages outweigh disadvantages if boundaries and communication are managed.",
    plan:
      "Para 1: flexibility and time savings. Para 2: isolation and blurred boundaries, with solutions.",
    usefulLanguage: ["work-life boundaries", "face-to-face coordination", "flexible working arrangements"],
    model:
      "In my view, the advantages of working from home generally outweigh the disadvantages, although this depends heavily on how work is organized. The clearest benefit is flexibility. Employees can save commuting time, arrange their day more efficiently and often work in an environment where they feel more comfortable. For many people, this leads to higher productivity and a better balance between professional and personal responsibilities.\n\nThat said, remote work can weaken communication and make some employees feel isolated. It can also blur the boundary between work and home, especially when people feel expected to reply to messages at all hours. These problems, however, are manageable. Companies can schedule regular meetings, set clear response times and bring teams together for tasks that require close coordination. Therefore, remote work is not perfect, but with sensible rules its benefits are more significant than its drawbacks.",
  },
  {
    prompt:
      "Some people think public money should be spent on arts and culture, while others think it should be spent on public services. Discuss both views and give your opinion.",
    position: "Public services should come first, but arts and culture still deserve stable funding.",
    plan:
      "Para 1: healthcare, education and transport are basic needs. Para 2: arts protect identity and improve public life.",
    usefulLanguage: ["essential services", "cultural identity", "a balanced funding model"],
    model:
      "People disagree about whether governments should prioritize arts and culture or public services. Those who support spending on services argue that healthcare, education and transport affect citizens' daily lives in the most direct way. If hospitals are overcrowded or schools lack resources, it is difficult to justify large cultural projects. From this perspective, public money should first protect people's basic well-being.\n\nHowever, arts and culture should not be treated as luxuries. Museums, theatres, festivals and local cultural programs help preserve identity and make cities more attractive places to live. They can also support tourism and creative employment. My view is that essential services should receive priority, especially when budgets are limited, but a reasonable level of cultural funding should remain. A society needs efficient services, but it also needs shared stories, public imagination and spaces where people can connect beyond work and consumption.",
  },
  {
    prompt:
      "In some countries, young people are leaving rural areas to live in cities. What problems does this cause, and what solutions can you suggest?",
    position: "The main problems are rural decline and urban pressure; solutions should improve opportunity outside cities.",
    plan:
      "Para 1: rural areas lose workers and services. Para 2: cities face housing and transport pressure. Solutions: jobs, internet, education.",
    usefulLanguage: ["rural decline", "urban pressure", "regional investment"],
    model:
      "The movement of young people from rural areas to cities can create serious problems for both places. In villages and small towns, the loss of young workers can weaken local businesses and reduce demand for schools, clinics and public transport. Over time, this may leave older residents with fewer services and fewer people to support the local economy. At the same time, large cities may face rising rents, crowded transport and stronger competition for entry-level jobs.\n\nGovernments should not simply tell young people to stay in rural areas; they need to make staying a realistic choice. This means investing in reliable internet, vocational training, small business support and transport links. Universities and companies could also be encouraged to open branches outside major cities. If rural areas offer modern services and genuine career prospects, young people will be less likely to see moving to the city as their only path to success.",
  },
  {
    prompt:
      "Some people believe that technological devices make communication between people weaker. To what extent do you agree or disagree?",
    position: "Partly agree; technology weakens shallow attention but can strengthen long-distance relationships.",
    plan:
      "Para 1: constant messaging reduces deep attention. Para 2: technology helps maintain relationships across distance.",
    usefulLanguage: ["surface-level interaction", "sustained attention", "maintain long-distance relationships"],
    model:
      "I partly agree that technological devices can weaken communication, but I do not think the problem is technology itself. Phones and social media often encourage short, surface-level exchanges. People may send quick reactions rather than listening carefully, and face-to-face conversations can be interrupted by notifications. In this sense, devices can reduce sustained attention and make communication feel less meaningful.\n\nOn the other hand, technology also allows people to maintain relationships that would otherwise fade. Video calls, voice messages and group chats help families, friends and colleagues stay connected across distance. The real issue is how these tools are used. If people rely on devices to avoid real conversation, communication becomes weaker. If they use them to arrange meetings, share ideas and support each other, communication can become more frequent and accessible. Therefore, I believe technology changes communication rather than simply damaging it.",
  },
  {
    prompt:
      "Some people think that universities should focus on practical skills for employment, while others believe they should provide academic knowledge. Discuss both views and give your opinion.",
    position: "Universities need both, but academic knowledge should be connected to real-world use.",
    plan:
      "Para 1: employment skills increase relevance. Para 2: academic knowledge builds critical thinking. Opinion: integration.",
    usefulLanguage: ["employability", "critical thinking", "bridge theory and practice"],
    model:
      "There are strong arguments on both sides of this debate. Supporters of practical training believe that universities should prepare students for employment. Courses that include internships, teamwork and industry-related projects can help graduates adapt more quickly to the workplace. This is especially important when students invest a great deal of time and money in higher education.\n\nHowever, universities should not become narrow job-training centres. Academic knowledge teaches students to analyze evidence, question assumptions and understand problems in depth. These abilities may not be linked to one specific job, but they are valuable across many careers. In my opinion, the best approach is to connect theory with practice. A business student, for example, should learn both economic principles and how companies make decisions. Universities should therefore protect academic depth while giving students more opportunities to apply what they learn.",
  },
];

const roadmap = [
  ["Week 1", "Automatic speaking response", "For Part 1, answer directly before adding detail."],
  ["Week 2", "Shadowing rhythm", "Train 5 chunks daily with weak forms and stress."],
  ["Week 3", "Focused listening", "Build a paraphrase bank and listen for meaning, not just words."],
  ["Week 4", "Reading location skills", "Question keywords, paragraph function, evidence sentences."],
  ["Week 5", "Task 2 body paragraphs", "Develop with reason, example, and result."],
  ["Week 6", "Part 2 story line", "Scene, feeling, detail, reflection."],
  ["Week 7", "Part 3 abstract ideas", "General view + contrast + example."],
  ["Week 8", "Listening-speaking transfer", "Retell and rephrase chunks immediately after hearing them."],
  ["Week 9", "Reading speed", "Practice timed judgment and matching tasks."],
  ["Week 10", "Writing coherence", "Use logic between paragraphs, not just linking words."],
  ["Week 11", "Mock-test week", "Train all four skills under test timing."],
  ["Week 12", "Final correction sprint", "Fix only high-frequency errors and speaking hesitation points."],
];

let state = loadState();
let currentChunkGroup = 0;
let currentPrompt = 0;
let currentShadow = 0;
let currentLongSentence = Number(new Date().toISOString().slice(8, 10)) % longSentences.length;
let currentReflex = 0;
let currentDictation = 0;
let currentPara = 0;
let currentPassage = 0;
let currentWriting = 0;
let selectedSpeechSeconds = 45;
let speechRemaining = selectedSpeechSeconds;
let speechElapsed = 0;
let speechTimerId = null;
let readingTimerId = null;
let selectedReadingSeconds = 40 * 60;
let readingRemaining = selectedReadingSeconds;
let recognition = null;
let finalTranscript = "";

const sectionChecklistIds = {
  speaking: "reflex",
  listening: "dictation",
  reading: "reading",
  writing: "writing",
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("ielts-fluency-lab") || "null");
    const merged = { ...defaultState, ...(saved || {}) };
    merged.completedChecklist = {
      ...defaultState.completedChecklist,
      ...(saved?.completedChecklist || {}),
    };
    merged.skillProgress = {
      ...defaultState.skillProgress,
      ...(saved?.skillProgress || {}),
    };
    merged.answerStats = {
      ...defaultState.answerStats,
      ...(saved?.answerStats || {}),
    };
    merged.speakingSessions = Array.isArray(saved?.speakingSessions) ? saved.speakingSessions : [];
    merged.writingSessions = Array.isArray(saved?.writingSessions) ? saved.writingSessions : [];
    merged.dailyRecords = saved?.dailyRecords && typeof saved.dailyRecords === "object" ? saved.dailyRecords : {};
    merged.activityLog = Array.isArray(saved?.activityLog) ? saved.activityLog : [];
    merged.roundHistory = Array.isArray(saved?.roundHistory) ? saved.roundHistory : [];
    if (merged.date !== todayKey) {
      merged.date = todayKey;
      merged.completedChecklist = merged.dailyRecords[todayKey]?.checklist || {};
    }
    return merged;
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem("ielts-fluency-lab", JSON.stringify(state));
}

function createRecordId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatRecordTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function incrementStat(key, amount = 1) {
  state.answerStats[key] = (state.answerStats[key] || 0) + amount;
}

function roundBand(value) {
  return Math.round(value * 2) / 2;
}

function bandFromRawScore(correct, total, type = "reading") {
  const scaled = Math.round((correct / Math.max(total, 1)) * 40);
  const thresholds =
    type === "listening"
      ? [
          [39, 9],
          [37, 8.5],
          [35, 8],
          [32, 7.5],
          [30, 7],
          [26, 6.5],
          [23, 6],
          [18, 5.5],
          [16, 5],
          [13, 4.5],
          [10, 4],
        ]
      : [
          [39, 9],
          [37, 8.5],
          [35, 8],
          [33, 7.5],
          [30, 7],
          [27, 6.5],
          [23, 6],
          [19, 5.5],
          [15, 5],
          [13, 4.5],
          [10, 4],
        ];
  const match = thresholds.find(([raw]) => scaled >= raw);
  return match ? match[1] : 3.5;
}

function speakingBandFromScore(score) {
  if (score >= 92) return 8.5;
  if (score >= 86) return 8;
  if (score >= 80) return 7.5;
  if (score >= 72) return 7;
  if (score >= 64) return 6.5;
  if (score >= 56) return 6;
  if (score >= 48) return 5.5;
  return 5;
}

function getDayRecord(date = todayKey) {
  if (!state.dailyRecords || typeof state.dailyRecords !== "object") state.dailyRecords = {};
  if (!state.dailyRecords[date]) {
    state.dailyRecords[date] = {
      date,
      checklist: {},
      tasks: {},
      overallBand: null,
      updatedAt: "",
    };
  }
  const record = state.dailyRecords[date];
  if (!record.checklist) record.checklist = {};
  if (!record.tasks) record.tasks = {};
  return record;
}

function getTaskRecord(section, date = todayKey) {
  return getDayRecord(date).tasks[section] || null;
}

function computeOverallBand(dayRecord) {
  const bands = ["speaking", "listening", "reading", "writing"]
    .map((section) => dayRecord.tasks?.[section]?.band)
    .filter((band) => typeof band === "number");
  return bands.length ? roundBand(bands.reduce((sum, band) => sum + band, 0) / bands.length) : null;
}

function computeListeningTaskBand(task) {
  const scores = [task.dictationScore, task.paraphraseScore].filter((score) => typeof score === "number");
  if (!scores.length) return typeof task.band === "number" ? task.band : null;
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return bandFromRawScore(average, 100, "listening");
}

function syncDayChecklist() {
  const dayRecord = getDayRecord();
  dayRecord.checklist = { ...state.completedChecklist };
  dayRecord.updatedAt = new Date().toISOString();
  dayRecord.overallBand = computeOverallBand(dayRecord);
}

function saveTaskResult(section, payload) {
  const dayRecord = getDayRecord();
  const checklistId = Object.prototype.hasOwnProperty.call(payload, "checklistId")
    ? payload.checklistId
    : sectionChecklistIds[section];
  if (checklistId) state.completedChecklist[checklistId] = true;
  const mergedTask = {
    ...(dayRecord.tasks[section] || {}),
    ...payload,
    complete: true,
    at: payload.at || new Date().toISOString(),
  };
  if (section === "listening") {
    mergedTask.band = computeListeningTaskBand(mergedTask);
  }
  dayRecord.tasks[section] = mergedTask;
  dayRecord.checklist = { ...state.completedChecklist };
  dayRecord.overallBand = computeOverallBand(dayRecord);
  dayRecord.updatedAt = new Date().toISOString();
  return dayRecord.tasks[section];
}

function renderCompletedModuleStates() {
  renderLongSentence();
  if (getTaskRecord("speaking")) renderSpeakingPrompt();
  if (getTaskRecord("listening")?.dictationComplete) renderDictation();
  if (getTaskRecord("reading")) renderPassage();
  if (getTaskRecord("writing")) renderWritingPrompt();
}

function saveAndRefreshGlobal() {
  syncDayChecklist();
  saveState();
  renderDashboard();
}

function getCompletedSectionCount(dayRecord = getDayRecord()) {
  return ["speaking", "listening", "reading", "writing"].filter((section) => dayRecord.tasks?.[section]?.complete).length;
}

function recordActivity({ type = "practice", skill = "general", title, detail, score = "", status = "done" }) {
  const entry = {
    id: createRecordId(type),
    at: new Date().toISOString(),
    date: todayKey,
    type,
    skill,
    title,
    detail,
    score,
    status,
  };
  state.activityLog.unshift(entry);
  state.activityLog = state.activityLog.slice(0, 80);
  state.lastActivityAt = entry.at;
  return entry;
}

function recordRoundCompletion(source = "manual") {
  const completedTasks = dailyItems.filter((item) => state.completedChecklist[item.id]);
  const percent = Math.round((completedTasks.length / dailyItems.length) * 100);
  const dayRecord = getDayRecord();
  const entry = {
    id: createRecordId("round"),
    at: new Date().toISOString(),
    date: todayKey,
    source,
    completed: completedTasks.length,
    total: dailyItems.length,
    percent,
    tasks: completedTasks.map((item) => item.title),
    overallBand: dayRecord.overallBand,
    completedSections: getCompletedSectionCount(dayRecord),
    skillProgress: { ...state.skillProgress },
  };
  state.roundHistory.unshift(entry);
  state.roundHistory = state.roundHistory.slice(0, 40);
  incrementStat("rounds");
  recordActivity({
    type: "round",
    skill: "all",
    title: "Full training round completed",
    detail: `${completedTasks.length}/${dailyItems.length} daily tasks marked done.`,
    score: `${percent}%`,
    status: "complete",
  });
  return entry;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function addProgress(skill, points) {
  state.skillProgress[skill] = clamp((state.skillProgress[skill] || 0) + points, 0, 100);
  saveAndRefreshGlobal();
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds);
  const min = String(Math.floor(safe / 60)).padStart(2, "0");
  const sec = String(safe % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function switchView(viewId) {
  $$(".view").forEach((view) => view.classList.toggle("is-visible", view.id === viewId));
  $$(".nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewId);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCalendar() {
  const panel = $("#calendarPanel");
  const grid = $("#calendarGrid");
  const toggle = $("#calendarToggleBtn");
  if (!panel || !grid || !toggle) return;

  panel.hidden = !state.calendarOpen;
  toggle.textContent = state.calendarOpen ? "Collapse calendar" : "Expand calendar";
  toggle.setAttribute("aria-expanded", String(state.calendarOpen));

  const records = Object.values(state.dailyRecords || {}).sort((a, b) => b.date.localeCompare(a.date));
  if (!records.length) {
    grid.innerHTML = `<div class="empty-record">No calendar records yet. Complete a section test to create the first daily score.</div>`;
    return;
  }

  grid.innerHTML = records
    .map((record) => {
      const sections = ["speaking", "listening", "reading", "writing"];
      const completedSections = sections.filter((section) => record.tasks?.[section]?.complete);
      const checklistDone = dailyItems.filter((item) => record.checklist?.[item.id]).length;
      const sectionLabels = sections
        .map((section) => {
          const task = record.tasks?.[section];
          return `<span class="${task?.complete ? "is-done" : ""}">${section}: ${task?.complete ? `Band ${task.band?.toFixed(1) || "--"}` : "open"}</span>`;
        })
        .join("");
      return `
        <div class="calendar-day">
          <div class="calendar-day-main">
            <strong>${escapeHtml(record.date)}</strong>
            <small>${completedSections.length}/4 scored sections · ${checklistDone}/${dailyItems.length} check-ins</small>
          </div>
          <div class="calendar-band">${record.overallBand ? `Overall ${record.overallBand.toFixed(1)}` : "No score"}</div>
          <div class="calendar-sections">${sectionLabels}</div>
        </div>
      `;
    })
    .join("");
}

function renderTracking(completed, percent) {
  const statusSummary = $("#statusSummary");
  if (!statusSummary) return;

  const dayRecord = getDayRecord();
  const activitiesToday = state.activityLog.filter((entry) => entry.date === todayKey).length;
  const savedAnswers = (state.answerStats.speakingSaves || 0) + (state.answerStats.writingSaves || 0);
  const checksRun =
    (state.answerStats.speakingAnalyses || 0) +
    (state.answerStats.phraseUpgrades || 0) +
    (state.answerStats.dictations || 0) +
    (state.answerStats.paraphrases || 0) +
    (state.answerStats.readings || 0) +
    (state.answerStats.writingAnalyses || 0);
  const roundCount = state.answerStats.rounds || state.roundHistory.length || 0;
  const lastActivity = state.activityLog[0];
  const lastRound = state.roundHistory[0];
  const completedSections = getCompletedSectionCount(dayRecord);

  const cards = [
    [
      "IELTS estimate",
      dayRecord.overallBand ? dayRecord.overallBand.toFixed(1) : "--",
      `${completedSections}/4 sections scored today`,
    ],
    ["Daily completion", `${percent}%`, `${completed}/${dailyItems.length} tasks done today`],
    ["Recorded actions", activitiesToday, lastActivity ? `Latest: ${lastActivity.title}` : "No action recorded yet"],
    ["Full rounds", roundCount, lastRound ? `Last round: ${formatRecordTime(lastRound.at)}` : "No full round yet"],
    ["Saved answers", savedAnswers, `Speaking ${state.answerStats.speakingSaves || 0} · Writing ${state.answerStats.writingSaves || 0}`],
    ["Checks run", checksRun, "Analysis, upgrade, dictation, paraphrase, reading, and writing checks"],
  ];

  statusSummary.innerHTML = cards
    .map(
      ([label, value, detail]) => `
        <div class="status-card">
          <span>${label}</span>
          <strong>${value}</strong>
          <small>${escapeHtml(detail)}</small>
        </div>
      `,
    )
    .join("");

  const activityTarget = $("#activityLog");
  if (activityTarget) {
    activityTarget.innerHTML = state.activityLog.length
      ? state.activityLog
          .slice(0, 8)
          .map(
            (entry) => `
              <div class="activity-item">
                <div>
                  <span>${formatRecordTime(entry.at)} · ${escapeHtml(entry.skill)}</span>
                  <strong>${escapeHtml(entry.title)}</strong>
                  <small>${escapeHtml(entry.detail)}</small>
                </div>
                <em>${escapeHtml(entry.score || entry.status)}</em>
              </div>
            `,
          )
          .join("")
      : `<div class="empty-record">No records yet. Analyze, check, or save an answer to start the log.</div>`;
  }

  const roundTarget = $("#roundHistory");
  if (roundTarget) {
    roundTarget.innerHTML = state.roundHistory.length
      ? state.roundHistory
          .slice(0, 6)
          .map(
            (entry, index) => `
              <div class="round-item">
                <div>
                  <span>${formatRecordTime(entry.at)}</span>
                  <strong>Round ${state.roundHistory.length - index}: ${entry.percent}% complete${entry.overallBand ? ` · Overall Band ${entry.overallBand.toFixed(1)}` : ""}</strong>
                  <small>${entry.completed}/${entry.total} tasks · ${entry.completedSections || 0}/4 scored sections · ${escapeHtml(entry.tasks.join(" / "))}</small>
                </div>
                <em>${escapeHtml(entry.source)}</em>
              </div>
            `,
          )
          .join("")
      : `<div class="empty-record">Complete one round to create a permanent round record.</div>`;
  }

  renderCalendar();
}

function renderDashboard() {
  const completed = dailyItems.filter((item) => state.completedChecklist[item.id]).length;
  const percent = Math.round((completed / dailyItems.length) * 100);
  $("#completionValue").textContent = `${percent}%`;
  $("#ringProgress").style.strokeDashoffset = String(308 - (308 * percent) / 100);
  $("#streakLabel").textContent = `${state.streak}-day streak`;

  $("#meterSpeaking").value = state.skillProgress.speaking;
  $("#meterListening").value = state.skillProgress.listening;
  $("#meterReading").value = state.skillProgress.reading;
  $("#meterWriting").value = state.skillProgress.writing;

  const checklist = $("#dailyChecklist");
  checklist.innerHTML = dailyItems
    .map(
      (item) => `
        <label class="check-item">
          <input type="checkbox" data-check-id="${item.id}" ${state.completedChecklist[item.id] ? "checked disabled" : ""} />
          <span>
            <strong>${item.title}</strong>
            <small>${item.detail}</small>
          </span>
          <em class="check-badge ${state.completedChecklist[item.id] ? "is-done" : ""}">
            ${state.completedChecklist[item.id] ? "Done" : "Pending"}
          </em>
        </label>
      `,
    )
    .join("");

  renderChunks();
  if ($("#longSentenceText")) renderLongSentence();
  renderTracking(completed, percent);
  renderListeningStatus();
  updateStreakIfComplete();
}

function renderChunks() {
  const group = chunkGroups[currentChunkGroup % chunkGroups.length];
  $("#chunkStack").innerHTML = group
    .map(
      ([phrase, note]) => `
        <div class="chunk-item">
          <strong>${phrase}</strong>
          <span>${note}</span>
        </div>
      `,
    )
    .join("");
}

function renderListeningStatus() {
  const pill = $("#listeningStatusPill");
  if (!pill) return;
  const saved = getTaskRecord("listening");
  if (saved?.complete && typeof saved.band === "number") {
    pill.textContent = `Listening Band ${saved.band.toFixed(1)}`;
    pill.classList.add("done");
    return;
  }
  pill.textContent = "No score yet";
  pill.classList.remove("done");
}

function updateStreakIfComplete() {
  const allDone = dailyItems.every((item) => state.completedChecklist[item.id]);
  if (!allDone || state.lastCompletionDate === todayKey) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  state.streak = state.lastCompletionDate === yesterday ? state.streak + 1 : 1;
  state.lastCompletionDate = todayKey;
  saveState();
  $("#streakLabel").textContent = `${state.streak}-day streak`;
}

function setChecklist(id, checked) {
  const item = dailyItems.find((entry) => entry.id === id);
  const dayRecord = getDayRecord();
  if (!checked && dayRecord.checklist?.[id]) {
    state.completedChecklist[id] = true;
    renderDashboard();
    showToast("Completed tasks stay locked for this day.");
    return;
  }
  state.completedChecklist[id] = checked;
  if (item) {
    recordActivity({
      type: "checklist",
      skill: item.skill,
      title: checked ? `${item.title} checked off` : `${item.title} reopened`,
      detail: item.detail,
      status: checked ? "done" : "reopened",
    });
  }
  if (checked && item) addProgress(item.skill, item.skill === "speaking" ? 7 : 5);
  syncDayChecklist();
  saveState();
  renderDashboard();
}

function renderSpeakingPrompt() {
  const saved = getTaskRecord("speaking");
  if (saved?.complete) {
    $("#promptType").textContent = saved.promptType || "IELTS Speaking";
    $("#speakingPrompt").textContent = saved.prompt || speakingPrompts[currentPrompt % speakingPrompts.length].text;
    $("#answerText").value = saved.answer || "";
    $("#naturalScore").textContent = saved.score ?? "--";
    $("#wpmMetric").textContent = saved.wpm ? `${saved.wpm} wpm` : "--";
    $("#linkMetric").textContent = saved.linkerCount ?? "--";
    $("#fillerMetric").textContent = saved.fillerCount ?? "--";
    $("#depthMetric").textContent = saved.wordCount ? `${saved.wordCount} words` : "--";
    $("#feedbackList").innerHTML =
      saved.feedbackHtml ||
      `<div class="feedback-item good">Today's speaking task is complete. Your answer and result are saved.</div>`;
    return;
  }
  const prompt = speakingPrompts[currentPrompt % speakingPrompts.length];
  $("#promptType").textContent = prompt.type;
  $("#speakingPrompt").textContent = prompt.text;
}

function createUtterance(text, rate = 0.94, volume = 1) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = volume;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((item) => /en-(US|GB)/i.test(item.lang)) || voices.find((item) => item.lang.startsWith("en"));
  if (voice) utterance.voice = voice;
  return utterance;
}

function speakText(text, rate = 0.94) {
  if (!("speechSynthesis" in window)) {
    showToast("This browser does not support speech playback.");
    return;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(createUtterance(text, rate));
}

function speakSequence(parts, gap = 420) {
  if (!("speechSynthesis" in window)) {
    showToast("This browser does not support speech playback.");
    return;
  }
  window.speechSynthesis.cancel();
  const queue = [...parts];
  const playNext = () => {
    const item = queue.shift();
    if (!item) return;
    const utterance = createUtterance(item.text, item.rate || 0.9, item.volume ?? 1);
    utterance.onend = () => setTimeout(playNext, item.gap ?? gap);
    window.speechSynthesis.speak(utterance);
  };
  playNext();
}

function playDictation(mode = "normal") {
  const item = dictations[currentDictation % dictations.length];
  const warmup = { text: "Ready", rate: 1, volume: 0, gap: 350 };
  if (mode === "slow") {
    speakSequence([warmup, { text: item.text, rate: 0.72 }], 450);
    return;
  }
  if (mode === "chunks") {
    const chunks = item.chunks || item.text.split(/,\s*|\s+and\s+/).filter(Boolean);
    speakSequence([warmup, ...chunks.map((text) => ({ text, rate: 0.78, gap: 700 }))], 620);
    return;
  }
  speakSequence([warmup, { text: item.text, rate: 0.84 }], 450);
}

function startSpeechTimer() {
  clearInterval(speechTimerId);
  speechRemaining = selectedSpeechSeconds;
  speechElapsed = 0;
  $("#speechTimer").textContent = formatTime(speechRemaining);
  speechTimerId = setInterval(() => {
    speechRemaining -= 1;
    speechElapsed += 1;
    $("#speechTimer").textContent = formatTime(speechRemaining);
    if (speechRemaining <= 0) stopSpeaking(true);
  }, 1000);
}

function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  const recognizer = new SpeechRecognition();
  recognizer.lang = "en-US";
  recognizer.continuous = true;
  recognizer.interimResults = true;
  recognizer.onresult = (event) => {
    let interim = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const transcript = event.results[index][0].transcript;
      if (event.results[index].isFinal) finalTranscript += `${transcript} `;
      else interim += transcript;
    }
    $("#answerText").value = `${finalTranscript}${interim}`.trim();
  };
  recognizer.onerror = () => {
    showToast("Speech recognition is unavailable. You can type your answer instead.");
    stopSpeaking(false);
  };
  recognizer.onend = () => {
    $("#startSpeakBtn").disabled = false;
    $("#stopSpeakBtn").disabled = true;
  };
  return recognizer;
}

function startSpeaking() {
  finalTranscript = `${$("#answerText").value.trim()} `;
  startSpeechTimer();
  $("#startSpeakBtn").disabled = true;
  $("#stopSpeakBtn").disabled = false;
  recognition = setupRecognition();
  if (recognition) {
    try {
      recognition.start();
      showToast("Speech transcription has started.");
    } catch {
      showToast("Speech recognition did not start. You can type your answer instead.");
    }
  } else {
    showToast("This browser does not support speech recognition. The timer has started.");
  }
}

function stopSpeaking(autoAnalyze) {
  clearInterval(speechTimerId);
  speechTimerId = null;
  $("#startSpeakBtn").disabled = false;
  $("#stopSpeakBtn").disabled = true;
  if (recognition) {
    try {
      recognition.stop();
    } catch {
      recognition = null;
    }
  }
  if (autoAnalyze) analyzeAnswer();
}

function wordsOf(text) {
  return (text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || []);
}

function countPhrase(text, phrase) {
  const normalized = text.toLowerCase();
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = normalized.match(new RegExp(`\\b${escaped}\\b`, "g"));
  return matches ? matches.length : 0;
}

function analyzeAnswer() {
  const text = $("#answerText").value.trim();
  if (!text) {
    showToast("Enter or record an answer first.");
    return;
  }

  const words = wordsOf(text);
  const duration = Math.max(20, speechElapsed || selectedSpeechSeconds);
  const wpm = Math.round((words.length / duration) * 60);
  const fillerList = ["um", "uh", "er", "like", "you know", "actually", "basically", "sort of", "kind of"];
  const linkers = [
    "because",
    "so",
    "for example",
    "for instance",
    "what i mean is",
    "that being said",
    "on the other hand",
    "in my case",
    "personally",
  ];
  const fillerCount = fillerList.reduce((sum, item) => sum + countPhrase(text, item), 0);
  const linkerCount = linkers.reduce((sum, item) => sum + countPhrase(text, item), 0);
  const sentenceCount = Math.max(1, (text.match(/[.!?]/g) || []).length);
  const avgSentence = Math.round(words.length / sentenceCount);
  const hasExample = /\b(for example|for instance|in my case|when i|last year|recently|one time)\b/i.test(text);

  let score = 52;
  if (wpm >= 95 && wpm <= 155) score += 16;
  else if (wpm >= 75 && wpm < 180) score += 9;
  if (linkerCount >= 2) score += 12;
  else if (linkerCount === 1) score += 7;
  if (fillerCount <= 2) score += 10;
  else if (fillerCount <= 5) score += 4;
  if (hasExample) score += 8;
  if (avgSentence >= 10 && avgSentence <= 24) score += 7;
  score = clamp(score, 0, 100);

  $("#naturalScore").textContent = score;
  $("#wpmMetric").textContent = `${wpm} wpm`;
  $("#linkMetric").textContent = linkerCount;
  $("#fillerMetric").textContent = fillerCount;
  $("#depthMetric").textContent = `${words.length} words`;

  const feedback = [];
  if (wpm < 90) {
    feedback.push(["warning", "Pace is slow: next round, answer directly with short sentences, then add reasons."]);
  } else if (wpm > 165) {
    feedback.push(["warning", "Pace is fast: keep natural pauses and stress opinion/example words."]);
  } else {
    feedback.push(["good", "Your pace is close to a natural speaking range. Keep controlled pauses."]);
  }

  if (linkerCount < 2) {
    feedback.push(["warning", "Linking is not clear enough: add chunks like because / in my case / that being said."]);
  } else {
    feedback.push(["good", "Your linking helps the answer move forward."]);
  }

  if (!hasExample) {
    feedback.push(["warning", "Add a real detail: use In my case... or A good example would be..."]);
  } else {
    feedback.push(["good", "You included a personal example, so the answer sounds more conversational."]);
  }

  if (fillerCount > 5) {
    feedback.push(["warning", "Too many fillers: replace um / like with a short pause or use what I mean is to repair."]);
  }

  if (words.length < 45) {
    feedback.push(["warning", "Development is limited: for Part 1, include point, reason, and detail."]);
  }

  $("#feedbackList").innerHTML = feedback
    .map((item) => `<div class="feedback-item ${item[0]}">${item[1]}</div>`)
    .join("");

  const band = speakingBandFromScore(score);
  saveTaskResult("speaking", {
    checklistId: "reflex",
    promptType: $("#promptType").textContent,
    prompt: $("#speakingPrompt").textContent,
    answer: text,
    score,
    band,
    wpm,
    linkerCount,
    fillerCount,
    wordCount: words.length,
    feedbackHtml: $("#feedbackList").innerHTML,
  });
  incrementStat("speakingAnalyses");
  recordActivity({
    type: "analysis",
    skill: "speaking",
    title: "Speaking answer analyzed",
    detail: `${words.length} words · ${wpm} wpm · ${linkerCount} linking chunks · prompt: ${$("#speakingPrompt").textContent.slice(0, 80)}`,
    score: `Band ${band.toFixed(1)}`,
    status: score >= 75 ? "strong" : "needs work",
  });
  addProgress("speaking", 8);
}

function saveSpeakingSession() {
  const text = $("#answerText").value.trim();
  if (!text) {
    showToast("There is no answer to save yet.");
    return;
  }
  state.speakingSessions.unshift({
    date: new Date().toISOString(),
    prompt: $("#speakingPrompt").textContent,
    answer: text,
    score: $("#naturalScore").textContent,
  });
  state.speakingSessions = state.speakingSessions.slice(0, 20);
  state.completedChecklist.shadow = true;
  state.completedChecklist.reflex = true;
  syncDayChecklist();
  incrementStat("speakingSaves");
  recordActivity({
    type: "save",
    skill: "speaking",
    title: "Speaking answer saved",
    detail: `${wordsOf(text).length} words saved for: ${$("#speakingPrompt").textContent.slice(0, 90)}`,
    score: $("#naturalScore").textContent !== "--" ? `Score ${$("#naturalScore").textContent}` : "Saved",
    status: "saved",
  });
  saveState();
  renderDashboard();
  showToast("Speaking session saved.");
}

function renderShadow() {
  const item = shadowLines[currentShadow % shadowLines.length];
  $("#shadowLine").textContent = item.line;
  $("#shadowNote").textContent = item.note;
}

function renderLongSentence() {
  const item = longSentences[currentLongSentence % longSentences.length];
  $("#longSentenceText").textContent = item.sentence;
  $("#longSentenceMeaning").textContent = item.meaning;
  $("#longSentenceFocus").textContent = item.focus;
  $("#longSentenceStatus").textContent = state.completedChecklist.longSentence ? "Done" : "Not checked in";
  $("#longSentenceStatus").classList.toggle("done", Boolean(state.completedChecklist.longSentence));
  $("#longSentenceChunks").innerHTML = item.chunks
    .map(
      (chunk, index) => `
        <div class="chunk-item sentence-chunk">
          <strong>Chunk ${index + 1}</strong>
          <span>${chunk}</span>
        </div>
      `,
    )
    .join("");
}

function playLongSentenceChunks() {
  const item = longSentences[currentLongSentence % longSentences.length];
  speakSequence(item.chunks.map((text) => ({ text, rate: 0.78, gap: 760 })), 700);
}

function renderReflex() {
  const item = reflexPrompts[currentReflex % reflexPrompts.length];
  $("#reflexMode").textContent = item.mode;
  $("#reflexPrompt").textContent = item.prompt;
  $("#modelAnswer").textContent = item.model;
  $("#modelAnswer").hidden = true;
  $("#reflexTimer").textContent = "05";
}

function startReflexTimer() {
  let remaining = 5;
  $("#reflexTimer").textContent = String(remaining).padStart(2, "0");
  clearInterval(startReflexTimer.timer);
  startReflexTimer.timer = setInterval(() => {
    remaining -= 1;
    $("#reflexTimer").textContent = String(Math.max(0, remaining)).padStart(2, "0");
    if (remaining <= 0) {
      clearInterval(startReflexTimer.timer);
      speakText($("#reflexPrompt").textContent, 0.96);
      showToast("Start answering out loud now.");
    }
  }, 1000);
}

function loadPhrasePractice() {
  const item = phraseBank[Math.floor(Math.random() * phraseBank.length)];
  $("#stiffPhrase").value = item.stiff;
  $("#naturalPhrase").value = "";
  $("#phraseResult").innerHTML = "";
}

function checkPhraseUpgrade() {
  const stiff = $("#stiffPhrase").value.trim();
  const natural = $("#naturalPhrase").value.trim();
  const item = phraseBank.find((entry) => entry.stiff === stiff) || phraseBank[0];
  const suggested = natural || item.natural;
  $("#naturalPhrase").value = suggested;
  $("#phraseResult").innerHTML = `
    <strong>Upgrade direction:</strong>${item.tip}<br />
    <strong>Practice version:</strong>${suggested}
  `;
  incrementStat("phraseUpgrades");
  recordActivity({
    type: "upgrade",
    skill: "speaking",
    title: "Spoken phrase upgraded",
    detail: `Original: ${stiff.slice(0, 80)} · Practice: ${suggested.slice(0, 80)}`,
    score: "Upgrade",
    status: "done",
  });
  addProgress("speaking", 4);
}

function renderDictation() {
  const item = dictations[currentDictation % dictations.length];
  $("#dictationTopic").textContent = `${item.topic} · ${currentDictation + 1}/${dictations.length}`;
  $("#dictationInput").value = "";
  $("#dictationResult").innerHTML = item.focus ? `<strong>Focus:</strong> ${item.focus}` : "";
  $("#dictationInput").disabled = false;
  $("#checkDictationBtn").disabled = false;
  const saved = getTaskRecord("listening");
  if (saved?.dictationComplete) {
    $("#dictationTopic").textContent = saved.topic || $("#dictationTopic").textContent;
    $("#dictationInput").value = saved.answer || "";
    $("#dictationResult").innerHTML =
      saved.dictationResultHtml ||
      `<strong>IELTS Listening estimate:</strong> Band ${saved.band?.toFixed(1) || "--"}<br />${escapeHtml(saved.transcript || "")}`;
    $("#dictationInput").disabled = true;
    $("#checkDictationBtn").disabled = true;
  }
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

function checkDictation() {
  const target = normalizeText(dictations[currentDictation % dictations.length].text);
  const input = normalizeText($("#dictationInput").value);
  if (!input) {
    showToast("Write the sentence you heard first.");
    return;
  }
  const distance = levenshtein(target, input);
  const score = Math.round((1 - distance / Math.max(target.length, 1)) * 100);
  const safeScore = clamp(score, 0, 100);
  $("#dictationResult").innerHTML = `
    <strong>Match score ${safeScore}%</strong><br />
    <strong>IELTS Listening estimate:</strong> Band ${bandFromRawScore(safeScore, 100, "listening").toFixed(1)}<br />
    Transcript: ${dictations[currentDictation % dictations.length].text}
  `;
  const listeningBand = bandFromRawScore(safeScore, 100, "listening");
  saveTaskResult("listening", {
    checklistId: "dictation",
    dictationComplete: true,
    topic: dictations[currentDictation % dictations.length].topic,
    answer: $("#dictationInput").value.trim(),
    transcript: dictations[currentDictation % dictations.length].text,
    dictationScore: safeScore,
    dictationResultHtml: $("#dictationResult").innerHTML,
  });
  incrementStat("dictations");
  recordActivity({
    type: "check",
    skill: "listening",
    title: "Dictation checked",
    detail: `${dictations[currentDictation % dictations.length].topic} · target sentence compared with your transcript.`,
    score: `Band ${listeningBand.toFixed(1)}`,
    status: safeScore >= 80 ? "passed" : "retry",
  });
  if (safeScore >= 80) {
    state.completedChecklist.dictation = true;
    addProgress("listening", 8);
  }
  saveState();
  renderDashboard();
  renderDictation();
}

function renderParaphrase() {
  const item = paraphrases[currentPara % paraphrases.length];
  const saved = getTaskRecord("listening");
  const answeredThisItem = saved?.paraphraseComplete && saved.paraphraseSource === item.source;
  $("#paraSource").textContent = item.source;
  $("#paraResult").innerHTML = answeredThisItem ? saved.paraphraseResultHtml : "";
  $("#paraOptions").innerHTML = item.options
    .map(
      (option) => `
        <button
          class="option-button ${answeredThisItem && option === item.answer ? "is-correct" : ""} ${answeredThisItem && option === saved.paraphraseSelected && !saved.paraphraseCorrect ? "is-wrong" : ""}"
          data-para-option="${option}"
          type="button"
          ${answeredThisItem ? "disabled" : ""}
        >${option}</button>
      `,
    )
    .join("");
}

function getReadingPool() {
  const ieltsPool = passages.filter((passage) => passage.level && passage.questions.length >= 5);
  return ieltsPool.length >= 3 ? ieltsPool : passages;
}

function getDailyReadingSet() {
  const pool = getReadingPool();
  const dateSeed = Number(todayKey.replace(/-/g, ""));
  const start = (dateSeed + currentPassage) % pool.length;
  return [0, 1, 2].map((offset) => pool[(start + offset) % pool.length]);
}

function renderPassage() {
  const set = getDailyReadingSet();
  const saved = getTaskRecord("reading");
  const totalQuestions = set.reduce((sum, passage) => sum + passage.questions.length, 0);
  const wordCount = set.reduce((sum, passage) => sum + wordsOf(passage.text).length, 0);
  $("#passageTitle").textContent = saved?.title || "IELTS Academic Reading Set";
  $("#passageMeta").textContent = `3 passages · ${totalQuestions} questions · ${wordCount} words · scaled to IELTS 40-question band`;
  $("#passageText").innerHTML = set
    .map(
      (passage, index) => `
        <article class="reading-passage-block">
          <span>Passage ${index + 1} · ${escapeHtml(passage.level || "IELTS style")}</span>
          <h4>${escapeHtml(passage.title)}</h4>
          <p>${escapeHtml(passage.text)}</p>
        </article>
      `,
    )
    .join("");

  let globalIndex = 0;
  $("#readingQuestions").innerHTML = set
    .map((passage, passageIndex) => {
      const questions = passage.questions
        .map((question) => {
          globalIndex += 1;
          const name = `reading-${globalIndex}`;
          return `
            <div class="question-item">
              <strong>${globalIndex}. ${escapeHtml(question.q)}</strong>
              <div class="question-options">
                ${question.options
                  .map(
                    (option, optionIndex) => `
                      <label>
                        <input type="radio" name="${name}" value="${optionIndex}" data-reading-question="${globalIndex - 1}" />
                        <span>${escapeHtml(option)}</span>
                      </label>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          `;
        })
        .join("");
      return `
        <div class="question-group">
          <h4>Passage ${passageIndex + 1}: ${escapeHtml(passage.title)}</h4>
          ${questions}
        </div>
      `;
    })
    .join("");

  $("#readingResult").innerHTML = "";
  $("#checkReadingBtn").disabled = false;
  $$("[data-reading-question]").forEach((input) => {
    input.disabled = false;
  });

  if (saved?.complete) {
    Object.entries(saved.answers || {}).forEach(([index, value]) => {
      const input = $(`input[data-reading-question="${index}"][value="${value}"]`);
      if (input) input.checked = true;
    });
    $("#readingResult").innerHTML =
      saved.resultHtml ||
      `<strong>IELTS Reading estimate:</strong> Band ${saved.band?.toFixed(1) || "--"}`;
    $$("[data-reading-question]").forEach((input) => {
      input.disabled = true;
    });
    $("#checkReadingBtn").disabled = true;
  }
}

function startReadingTimer() {
  clearInterval(readingTimerId);
  readingRemaining = selectedReadingSeconds;
  $("#readingTimer").textContent = formatTime(readingRemaining);
  readingTimerId = setInterval(() => {
    readingRemaining -= 1;
    $("#readingTimer").textContent = formatTime(readingRemaining);
    if (readingRemaining <= 0) {
      clearInterval(readingTimerId);
      showToast("Reading timer finished.");
    }
  }, 1000);
}

function checkReading() {
  const set = getDailyReadingSet();
  let correct = 0;
  const evidence = [];
  const answers = {};
  const flatQuestions = set.flatMap((passage, passageIndex) =>
    passage.questions.map((question) => ({
      ...question,
      passageTitle: passage.title,
      passageIndex,
    })),
  );
  flatQuestions.forEach((question, index) => {
    const chosen = $(`input[name="reading-${index + 1}"]:checked`);
    if (chosen) answers[index] = Number(chosen.value);
    if (chosen && Number(chosen.value) === question.answer) correct += 1;
    evidence.push(
      `<div class="evidence-line ${chosen && Number(chosen.value) === question.answer ? "is-correct" : "is-wrong"}">
        <strong>${index + 1}. ${chosen ? (Number(chosen.value) === question.answer ? "Correct" : "Wrong") : "Missing"}</strong>
        ${escapeHtml(question.passageTitle)}: ${escapeHtml(question.evidence)}
      </div>`,
    );
  });

  if (Object.keys(answers).length < flatQuestions.length) {
    showToast("Answer every reading question before submitting.");
    return;
  }

  const band = bandFromRawScore(correct, flatQuestions.length, "reading");
  $("#readingResult").innerHTML = `
    <strong>${correct}/${flatQuestions.length} correct · IELTS Reading estimate: Band ${band.toFixed(1)}</strong>
    <p>This score is scaled to the IELTS Academic Reading 40-question band table.</p>
    ${evidence.join("")}
  `;
  state.completedChecklist.reading = true;
  saveTaskResult("reading", {
    checklistId: "reading",
    title: "IELTS Academic Reading Set",
    passageTitles: set.map((passage) => passage.title),
    answers,
    correct,
    total: flatQuestions.length,
    band,
    resultHtml: $("#readingResult").innerHTML,
  });
  incrementStat("readings");
  recordActivity({
    type: "check",
    skill: "reading",
    title: "Reading passage submitted",
    detail: `IELTS Academic Reading Set · ${correct}/${flatQuestions.length} answers correct.`,
    score: `Band ${band.toFixed(1)}`,
    status: band >= 7 ? "passed" : "retry",
  });
  addProgress("reading", 8);
  saveState();
  renderDashboard();
  renderPassage();
}

function loadImportedReading() {
  const title = $("#importReadingTitle").value.trim() || "Imported IELTS Practice Passage";
  const text = $("#importReadingText").value.trim();
  const questionLines = $("#importReadingQuestions").value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!text || questionLines.length < 2) {
    showToast("Paste a passage and at least 2 formatted questions.");
    return;
  }

  const questions = questionLines
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length < 6) return null;
      const answer = clamp(Number(parts[4]) - 1, 0, 2);
      return {
        q: parts[0],
        options: [parts[1], parts[2], parts[3]],
        answer,
        evidence: parts[5],
      };
    })
    .filter(Boolean);

  if (questions.length < 2) {
    showToast("Wrong format: question | A | B | C | correct number | evidence sentence");
    return;
  }

  passages.unshift({
    level: "Imported official/self-owned material",
    title,
    text,
    questions,
  });
  currentPassage = 0;
  renderPassage();
  showToast("Custom reading material loaded.");
  switchView("reading");
}

function getWritingTask() {
  return writingPrompts[currentWriting % writingPrompts.length];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderWritingPrompt() {
  const saved = getTaskRecord("writing");
  if (saved?.complete) {
    $("#writingPrompt").textContent = saved.prompt || getWritingTask().prompt;
    $("#essayInput").value = saved.essay || "";
    $("#thesisInput").value = saved.thesis || "";
    $("#bodyOneInput").value = saved.bodyOne || "";
    $("#bodyTwoInput").value = saved.bodyTwo || "";
    $("#essayFeedback").innerHTML =
      saved.feedbackHtml ||
      `<div class="feedback-item good">Today's writing task is complete. Your draft and result are saved.</div>`;
    $("#writingReview").innerHTML =
      saved.reviewHtml ||
      `<div class="review-block"><h4>Saved writing result</h4><p><strong>Estimated band:</strong> ${saved.band?.toFixed(1) || "--"} / 9.0</p></div>`;
    updateWordCount();
    return;
  }
  const task = getWritingTask();
  $("#writingPrompt").textContent = task.prompt;
  $("#writingReview").innerHTML = `
    <div class="review-block">
      <h4>High-score planning direction</h4>
      <p><strong>Position:</strong> ${escapeHtml(task.position)}</p>
      <p><strong>Plan:</strong> ${escapeHtml(task.plan)}</p>
      <p><strong>Useful language:</strong> ${task.usefulLanguage.map(escapeHtml).join(" · ")}</p>
    </div>
  `;
}

function updateWordCount() {
  $("#wordCount").textContent = wordsOf($("#essayInput").value).length;
}

function estimateWritingBand({ wordCount, paragraphs, linkerCount, hasExample, hasClearPosition }) {
  let band = 5.5;
  if (wordCount >= 120) band += 0.4;
  if (wordCount >= 220) band += 0.5;
  if (paragraphs >= 3) band += 0.5;
  if (linkerCount >= 3) band += 0.4;
  if (hasExample) band += 0.4;
  if (hasClearPosition) band += 0.4;
  return clamp(Math.round(band * 2) / 2, 5, 8);
}

function buildSentenceCorrections(essay) {
  const patterns = [
    {
      find: /\bvery important\b/gi,
      replace: "crucial / significant",
      why: "Replace very important with a more precise adjective, but do not overuse difficult words.",
    },
    {
      find: /\bmore and more\b/gi,
      replace: "an increasing number of",
      why: "an increasing number of is more formal in writing.",
    },
    {
      find: /\bin modern society\b/gi,
      replace: "in many contemporary contexts",
      why: "modern society can sound formulaic; use a more specific expression.",
    },
    {
      find: /\bgood\b/gi,
      replace: "beneficial / effective / practical",
      why: "good is too broad; choose beneficial, effective, or practical by context.",
    },
    {
      find: /\bbad\b/gi,
      replace: "harmful / counterproductive / problematic",
      why: "bad is too informal; specify the type of negative effect.",
    },
    {
      find: /\bpeople can\b/gi,
      replace: "individuals are able to",
      why: "Increase formality slightly while keeping the sentence clear.",
    },
  ];
  const sentences = (essay.match(/[^.!?]+[.!?]?/g) || []).map((item) => item.trim()).filter(Boolean).slice(0, 5);
  const corrections = [];

  sentences.forEach((sentence) => {
    let better = sentence;
    const reasons = [];
    patterns.forEach((pattern) => {
      if (pattern.find.test(sentence)) {
        better = better.replace(pattern.find, pattern.replace);
        reasons.push(pattern.why);
      }
      pattern.find.lastIndex = 0;
    });

    if (reasons.length) {
      corrections.push({ original: sentence, better, why: reasons.join(" ") });
    }
  });

  if (!corrections.length && sentences.length) {
    corrections.push({
      original: sentences[0],
      better: `${sentences[0].replace(/[.!?]$/, "")}, which means the argument needs a more concrete consequence or example.`,
      why: "When vocabulary is acceptable, improve depth by adding a consequence or example after the reason.",
    });
  }

  return corrections;
}

function analyzeEssay() {
  const task = getWritingTask();
  const essay = $("#essayInput").value.trim();
  const thesis = $("#thesisInput").value.trim();
  const bodyOne = $("#bodyOneInput").value.trim();
  const bodyTwo = $("#bodyTwoInput").value.trim();
  const wordCount = wordsOf(essay).length;
  if (!wordCount) {
    showToast("Write a draft before running the IELTS writing check.");
    return;
  }
  const paragraphs = essay.split(/\n\s*\n/).filter(Boolean).length;
  const linkers = ["however", "therefore", "for example", "for instance", "because", "although", "while", "as a result", "this means", "in contrast"];
  const linkerCount = linkers.reduce((sum, item) => sum + countPhrase(essay, item), 0);
  const hasExample = /\b(for example|for instance|such as|in my view|for this reason|this means)\b/i.test(essay);
  const hasClearPosition = thesis.length >= 12 || /\b(i agree|i disagree|in my view|i believe|the advantages|outweigh)\b/i.test(essay);
  const band = estimateWritingBand({ wordCount, paragraphs, linkerCount, hasExample, hasClearPosition });
  const feedback = [];

  if (hasClearPosition) feedback.push(["good", "The position is visible: your opening or outline has a clear direction."]);
  else feedback.push(["warning", "The position is not clear enough: answer the question directly in the opening."]);

  if (bodyOne && bodyTwo) feedback.push(["good", "Body paragraph directions are complete enough for development."]);
  else feedback.push(["warning", "Body paragraph planning is incomplete: each paragraph needs a main reason plus an example or result."]);

  if (wordCount < 180) feedback.push(["warning", `${wordCount} words: too short. Expand each body paragraph into reason + example + result.`]);
  else feedback.push(["good", `${wordCount} words: long enough for high-band polishing.`]);

  if (linkerCount < 3) feedback.push(["warning", "Logical signals are limited: add because / however / for example / as a result / this means."]);
  else feedback.push(["good", "Logical signals are sufficient. Next, check whether the links sound natural rather than stacked."]);

  $("#essayFeedback").innerHTML = feedback
    .map((item) => `<div class="feedback-item ${item[0]}">${item[1]}</div>`)
    .join("");

  const corrections = buildSentenceCorrections(essay);
  const correctionHtml = corrections.length
    ? corrections
        .map(
          (item) => `
            <div class="correction-card">
              <span>Original</span>
              <p>${escapeHtml(item.original)}</p>
              <span>Better</span>
              <p>${escapeHtml(item.better)}</p>
              <small>${escapeHtml(item.why)}</small>
            </div>
          `,
        )
        .join("")
    : `<p>Write a draft first; sentence-level corrections and upgrades will appear here.</p>`;

  $("#writingReview").innerHTML = `
    <div class="review-block">
      <h4>Estimated IELTS writing level</h4>
      <p><strong>Estimated band:</strong> ${band.toFixed(1)} / 9.0</p>
      <p><strong>English feedback:</strong> Your answer ${hasClearPosition ? "has a visible position" : "needs a clearer position"}. ${hasExample ? "It includes some development" : "It needs a more specific example or consequence"}. To move towards Band 7.5+, make each paragraph develop one idea in a precise and controlled way.</p>
      <p><strong>Training diagnosis:</strong> This is not an official score. It is a practice diagnosis based on position, length, paragraphs, linking, and development. For Band 7.5-8, clarity, development, and precision matter more than rare words.</p>
    </div>
    <div class="review-block">
      <h4>Task analysis</h4>
      <p><strong>Question:</strong> ${escapeHtml(task.prompt)}</p>
      <p><strong>Recommended position:</strong> ${escapeHtml(task.position)}</p>
      <p><strong>High-score structure:</strong> ${escapeHtml(task.plan)}</p>
      <p><strong>Useful language:</strong> ${task.usefulLanguage.map(escapeHtml).join(" · ")}</p>
    </div>
    <div class="review-block">
      <h4>Sentence correction and upgrading</h4>
      ${correctionHtml}
    </div>
    <div class="review-block model-answer-block">
      <h4>Band 7.5-8 sample answer</h4>
      ${task.model
        .split("\n")
        .filter(Boolean)
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join("")}
    </div>
  `;

  state.completedChecklist.writing = true;
  saveTaskResult("writing", {
    checklistId: "writing",
    prompt: task.prompt,
    essay,
    thesis,
    bodyOne,
    bodyTwo,
    wordCount,
    paragraphs,
    linkerCount,
    band,
    feedbackHtml: $("#essayFeedback").innerHTML,
    reviewHtml: $("#writingReview").innerHTML,
  });
  incrementStat("writingAnalyses");
  recordActivity({
    type: "analysis",
    skill: "writing",
    title: "Writing draft analyzed",
    detail: `${wordCount} words · ${paragraphs} paragraphs · ${linkerCount} logical signals.`,
    score: `Band ${band.toFixed(1)}`,
    status: band >= 7 ? "strong" : "needs work",
  });
  addProgress("writing", 7);
}

function saveWriting() {
  const essay = $("#essayInput").value.trim();
  if (!essay) {
    showToast("There is no writing to save yet.");
    return;
  }
  state.writingSessions.unshift({
    date: new Date().toISOString(),
    prompt: $("#writingPrompt").textContent,
    essay,
  });
  state.writingSessions = state.writingSessions.slice(0, 20);
  state.completedChecklist.writing = true;
  syncDayChecklist();
  incrementStat("writingSaves");
  recordActivity({
    type: "save",
    skill: "writing",
    title: "Writing draft saved",
    detail: `${wordsOf(essay).length} words saved for: ${$("#writingPrompt").textContent.slice(0, 90)}`,
    score: "Saved",
    status: "saved",
  });
  saveState();
  renderDashboard();
  showToast("Writing session saved.");
}

function renderPlanner() {
  $("#plannerGrid").innerHTML = roadmap
    .map(
      ([week, title, detail], index) => `
        <div class="week-card ${state.week === index + 1 ? "is-current" : ""}">
          <span>${week}</span>
          <strong>${title}</strong>
          <p>${detail}</p>
        </div>
      `,
    )
    .join("");
}

function setupEvents() {
  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  $$("[data-view-jump]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.viewJump));
  });

  $("#jumpSpeakingBtn").addEventListener("click", () => switchView("speaking"));
  $("#resetDayBtn").addEventListener("click", () => {
    const dayRecord = getDayRecord();
    state.completedChecklist = { ...(dayRecord.checklist || {}) };
    state.skillProgress = {
      speaking: Math.max(state.completedChecklist.shadow || state.completedChecklist.reflex || state.completedChecklist.longSentence ? state.skillProgress.speaking : 0, 0),
      listening: Math.max(state.completedChecklist.dictation ? state.skillProgress.listening : 0, 0),
      reading: Math.max(state.completedChecklist.reading ? state.skillProgress.reading : 0, 0),
      writing: Math.max(state.completedChecklist.writing ? state.skillProgress.writing : 0, 0),
    };
    recordActivity({
      type: "reset",
      skill: "all",
      title: "Daily checklist reset",
      detail: "Only unfinished check-ins were cleared. Completed task records were kept.",
      score: "Reset",
      status: "reset",
    });
    saveAndRefreshGlobal();
    renderCompletedModuleStates();
    showToast("Today's progress has been reset.");
  });

  $("#completeAllBtn").addEventListener("click", () => {
    dailyItems.forEach((item) => {
      state.completedChecklist[item.id] = true;
      state.skillProgress[item.skill] = clamp(state.skillProgress[item.skill] + 3, 0, 100);
    });
    syncDayChecklist();
    recordRoundCompletion("dashboard");
    saveAndRefreshGlobal();
    renderCompletedModuleStates();
    showToast("One full round completed.");
  });

  $("#calendarToggleBtn").addEventListener("click", () => {
    state.calendarOpen = !state.calendarOpen;
    saveState();
    renderCalendar();
  });

  $("#dailyChecklist").addEventListener("change", (event) => {
    if (event.target.matches("[data-check-id]")) {
      setChecklist(event.target.dataset.checkId, event.target.checked);
    }
  });

  $("#shuffleChunkBtn").addEventListener("click", () => {
    currentChunkGroup += 1;
    renderChunks();
  });

  $("#newPromptBtn").addEventListener("click", () => {
    currentPrompt += 1;
    renderSpeakingPrompt();
  });

  $$("[data-seconds]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("[data-seconds]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      selectedSpeechSeconds = Number(button.dataset.seconds);
      speechRemaining = selectedSpeechSeconds;
      $("#speechTimer").textContent = formatTime(speechRemaining);
    });
  });

  $("#startSpeakBtn").addEventListener("click", startSpeaking);
  $("#stopSpeakBtn").addEventListener("click", () => stopSpeaking(false));
  $("#speakPromptBtn").addEventListener("click", () => speakText($("#speakingPrompt").textContent, 0.92));
  $("#analyzeAnswerBtn").addEventListener("click", analyzeAnswer);
  $("#saveSpeakingBtn").addEventListener("click", saveSpeakingSession);

  $("#nextShadowBtn").addEventListener("click", () => {
    currentShadow += 1;
    renderShadow();
  });
  $("#playShadowBtn").addEventListener("click", () => speakText($("#shadowLine").textContent, 0.9));
  $("#markShadowBtn").addEventListener("click", () => {
    state.completedChecklist.shadow = true;
    syncDayChecklist();
    recordActivity({
      type: "check",
      skill: "speaking",
      title: "Shadowing round completed",
      detail: $("#shadowLine").textContent,
      score: "Done",
      status: "done",
    });
    addProgress("speaking", 5);
    saveState();
    renderDashboard();
    showToast("Shadowing recorded.");
  });

  $("#playLongSentenceBtn").addEventListener("click", () => {
    const item = longSentences[currentLongSentence % longSentences.length];
    speakText(item.sentence, 0.78);
  });
  $("#playLongSentenceChunksBtn").addEventListener("click", playLongSentenceChunks);
  $("#markLongSentenceBtn").addEventListener("click", () => {
    state.completedChecklist.longSentence = true;
    syncDayChecklist();
    recordActivity({
      type: "check",
      skill: "speaking",
      title: "Daily complex sentence memorized",
      detail: $("#longSentenceText").textContent.slice(0, 120),
      score: "Done",
      status: "done",
    });
    addProgress("speaking", 6);
    saveState();
    renderDashboard();
    showToast("Daily complex sentence checked in.");
  });
  $("#nextLongSentenceBtn").addEventListener("click", () => {
    currentLongSentence += 1;
    renderLongSentence();
  });

  $("#nextReflexBtn").addEventListener("click", () => {
    currentReflex += 1;
    renderReflex();
  });
  $("#startReflexBtn").addEventListener("click", startReflexTimer);
  $("#showModelBtn").addEventListener("click", () => {
    const willShow = $("#modelAnswer").hidden;
    $("#modelAnswer").hidden = !$("#modelAnswer").hidden;
    if (willShow) {
      state.completedChecklist.reflex = true;
      syncDayChecklist();
      recordActivity({
        type: "check",
        skill: "speaking",
        title: "Instant response model reviewed",
        detail: $("#reflexPrompt").textContent,
        score: "Done",
        status: "done",
      });
      addProgress("speaking", 4);
    }
    saveState();
    renderDashboard();
  });

  $("#loadPhraseBtn").addEventListener("click", loadPhrasePractice);
  $("#checkPhraseBtn").addEventListener("click", checkPhraseUpgrade);
  $("#playNaturalBtn").addEventListener("click", () => {
    const text = $("#naturalPhrase").value.trim() || $("#phraseResult").textContent;
    if (text) speakText(text, 0.92);
  });

  $("#nextDictationBtn").addEventListener("click", () => {
    currentDictation += 1;
    renderDictation();
  });
  $("#playDictationBtn").addEventListener("click", () => playDictation("normal"));
  $("#slowDictationBtn").addEventListener("click", () => playDictation("slow"));
  $("#chunkDictationBtn").addEventListener("click", () => playDictation("chunks"));
  $("#revealDictationBtn").addEventListener("click", () => {
    const item = dictations[currentDictation % dictations.length];
    $("#dictationResult").innerHTML = `<strong>Transcript:</strong>${item.text}<br /><strong>Focus:</strong> ${item.focus || ""}`;
  });
  $("#checkDictationBtn").addEventListener("click", checkDictation);

  $("#nextParaBtn").addEventListener("click", () => {
    currentPara += 1;
    renderParaphrase();
  });
  $("#paraOptions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-para-option]");
    if (!button) return;
    const item = paraphrases[currentPara % paraphrases.length];
    const correct = button.dataset.paraOption === item.answer;
    $$("#paraOptions .option-button").forEach((optionButton) => {
      optionButton.classList.toggle("is-correct", optionButton.dataset.paraOption === item.answer);
      optionButton.classList.toggle("is-wrong", optionButton === button && !correct);
      optionButton.disabled = true;
    });
    const paraphraseBand = bandFromRawScore(correct ? 1 : 0, 1, "listening");
    $("#paraResult").innerHTML = correct
      ? `<strong>Correct · IELTS Listening estimate: Band ${paraphraseBand.toFixed(1)}</strong><br />Listening tasks often use paraphrases to make location harder.`
      : `<strong>Answer: ${escapeHtml(item.answer)} · IELTS Listening estimate: Band ${paraphraseBand.toFixed(1)}</strong><br />Record kept. Review this paraphrase before the next set.`;
    const updatedListening = saveTaskResult("listening", {
      checklistId: "dictation",
      paraphraseComplete: true,
      paraphraseSource: item.source,
      paraphraseSelected: button.dataset.paraOption,
      paraphraseAnswer: item.answer,
      paraphraseCorrect: correct,
      paraphraseResultHtml: $("#paraResult").innerHTML,
      paraphraseScore: correct ? 100 : 0,
    });
    const displayedListeningBand = updatedListening.band || paraphraseBand;
    const paraphraseResultHtml = correct
      ? `<strong>Correct · Listening progress: Band ${displayedListeningBand.toFixed(1)}</strong><br />Listening tasks often use paraphrases to make location harder.`
      : `<strong>Answer: ${escapeHtml(item.answer)} · Listening progress: Band ${displayedListeningBand.toFixed(1)}</strong><br />Record kept. Review this paraphrase before the next set.`;
    $("#paraResult").innerHTML = paraphraseResultHtml;
    updatedListening.paraphraseResultHtml = paraphraseResultHtml;
    incrementStat("paraphrases");
    recordActivity({
      type: "check",
      skill: "listening",
      title: "Paraphrase item answered",
      detail: `${item.source} -> selected ${button.dataset.paraOption}; answer ${item.answer}.`,
      score: `Band ${displayedListeningBand.toFixed(1)}`,
      status: correct ? "passed" : "retry",
    });
    addProgress("listening", correct ? 5 : 1);
    showToast(`Listening progress updated: Band ${displayedListeningBand.toFixed(1)}.`);
  });

  $("#startReadingBtn").addEventListener("click", startReadingTimer);
  $$("[data-reading-seconds]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("[data-reading-seconds]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      selectedReadingSeconds = Number(button.dataset.readingSeconds);
      readingRemaining = selectedReadingSeconds;
      $("#readingTimer").textContent = formatTime(readingRemaining);
    });
  });
  $("#randomPassageBtn").addEventListener("click", () => {
    currentPassage += Math.max(1, Math.floor(Math.random() * getReadingPool().length));
    renderPassage();
  });
  $("#nextPassageBtn").addEventListener("click", () => {
    currentPassage += 1;
    renderPassage();
  });
  $("#checkReadingBtn").addEventListener("click", checkReading);
  $("#loadImportedReadingBtn").addEventListener("click", loadImportedReading);

  $("#nextWritingBtn").addEventListener("click", () => {
    currentWriting += 1;
    renderWritingPrompt();
  });
  $("#essayInput").addEventListener("input", updateWordCount);
  $("#analyzeEssayBtn").addEventListener("click", analyzeEssay);
  $("#saveWritingBtn").addEventListener("click", saveWriting);

  $("#markWeekBtn").addEventListener("click", () => {
    state.week = state.week >= roadmap.length ? 1 : state.week + 1;
    saveState();
    renderPlanner();
  });
  $("#copyFormulaBtn").addEventListener("click", async () => {
    const formula = "Part 1: direct answer -> tiny reason -> personal detail\nPart 2: scene -> feeling -> concrete moment -> reflection\nPart 3: general view -> contrast -> example -> soft conclusion";
    try {
      await navigator.clipboard.writeText(formula);
      showToast("Answer framework copied.");
    } catch {
      showToast("This browser does not allow clipboard copying.");
    }
  });
}

function animateVoiceCanvas() {
  const canvas = $("#voiceCanvas");
  const context = canvas.getContext("2d");
  let tick = 0;

  function draw() {
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#11252a";
    context.fillRect(0, 0, width, height);

    for (let row = 0; row < 5; row += 1) {
      context.beginPath();
      const color = ["#35b3a8", "#f26b51", "#e4a63a", "#6d94db", "#89b66f"][row];
      context.strokeStyle = color;
      context.globalAlpha = 0.7 - row * 0.08;
      context.lineWidth = 3;
      const base = height * (0.25 + row * 0.12);
      for (let x = 0; x <= width; x += 8) {
        const y =
          base +
          Math.sin(x * 0.018 + tick * (0.04 + row * 0.01)) * (18 + row * 4) +
          Math.cos(x * 0.041 + tick * 0.03) * 8;
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }

    context.globalAlpha = 1;
    tick += 1;
    requestAnimationFrame(draw);
  }

  draw();
}

function init() {
  setupEvents();
  renderDashboard();
  renderSpeakingPrompt();
  renderShadow();
  renderLongSentence();
  renderReflex();
  renderDictation();
  renderParaphrase();
  renderPassage();
  renderWritingPrompt();
  renderPlanner();
  $("#speechTimer").textContent = formatTime(selectedSpeechSeconds);
  $("#readingTimer").textContent = formatTime(selectedReadingSeconds);
  animateVoiceCanvas();
}

document.addEventListener("DOMContentLoaded", init);
