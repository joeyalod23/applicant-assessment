window.ASSESS = {

  questionnaire: [
    "Tell me about yourself.",
    "Why are you leaving your job?",
    "Why should we hire you?",
    "What do you know about the Company?",
    "Why do you want to work here?",
    "What are your weaknesses?",
    "What is your greatest strength(s)?",
    "What was your greatest accomplishment(s)?",
    "What do you like about your present job?",
    "What is your ideal job?",
    "What do you dislike about your present job?",
    "Are you happy with your career to date?",
    "How do you handle stress and pressure?",
    "What are you currently earning?",
    "What are your salary expectations? What minimum rate would you consider right now?",
    "Do you have any job offers? Are you interviewing anywhere else?",
    "When could you start working here?",
    "What things do you not enjoy doing?",
    "What is something NOT in your resume or portfolio?",
    "What are the top 3 most important things in life?"
  ],

  familyDefaults: [
    { relation: "Father", role: "father" },
    { relation: "Mother", role: "mother" },
    { relation: "Sibling 1", role: "sibling" },
    { relation: "Sibling 2", role: "sibling" },
    { relation: "Sibling 3", role: "sibling" },
    { relation: "Sibling 4", role: "sibling" },
    { relation: "Sibling 5", role: "sibling" },
    { relation: "Husband / Wife / Live-in Partner", role: "spouse" },
    { relation: "Child 1", role: "child" },
    { relation: "Child 2", role: "child" }
  ],

  familyRoleOptions: ["Father", "Mother", "Sibling", "Husband / Wife / Live-in Partner", "Child", "Other"],

  temperament: [
    {
      key: "choleric",
      name: "Choleric",
      tagline: "The Dominant Driver",
      description: "Bold, goal-driven and self-reliant. A natural leader who takes charge, loves challenges and gets results. Weaknesses: can be controlling, impatient and overly task-focused.",
      words: [
        "Persistent", "Like to take charge", "Confident", "Determined", "Firm", "Enterprising",
        "Enjoys challenges", "Competitive", "Problem Solver", "Productive", "Bold", "Purposeful",
        "Goal Driven", "Adventurous", "Strong willed", "Independent", "Self-reliant",
        "Controlling", "Like Having Authority", "Action oriented"
      ]
    },
    {
      key: "sanguine",
      name: "Sanguine",
      tagline: "The Enthusiastic Socializer",
      description: "Energetic, creative and people-oriented. Motivates others, loves variety and brings life to the room. Weaknesses: can be impulsive, disorganized and easily distracted.",
      words: [
        "Enthusiastic", "Like to take risk", "Visionary", "Motivator", "Energetic", "Very verbal",
        "Promoter", "Friendly", "Mix easily with others", "Enjoy popularity", "Fun-loving",
        "Like variety", "Spontaneous", "Enjoy change", "Creative / new ideas", "Group oriented",
        "Positive", "Initiator", "Infectious laughter", "Inspirational"
      ]
    },
    {
      key: "melancholic",
      name: "Melancholic",
      tagline: "The Analytical Thinker",
      description: "Detailed, precise and orderly. Values quality, accuracy and deep thinking. Weaknesses: can be overly critical, perfectionistic and slow to decide.",
      words: [
        "Detailed", "Accurate", "Consistent", "Controlled", "Reserved", "Predictable", "Practical",
        "Orderly", "Factual", "Meticulous", "Perfectionist", "Discerning", "Enjoy instructions",
        "Analytical", "Thinker", "Precise", "Persistent", "Scheduled", "Sensitive", "Intentional"
      ]
    },
    {
      key: "phlegmatic",
      name: "Phlegmatic",
      tagline: "The Calm Peacemaker",
      description: "Patient, loyal and supportive. Keeps harmony, listens well and stays steady under pressure. Weaknesses: can be indecisive, avoidant and resistant to change.",
      words: [
        "Sensitive feeling", "Loyal", "Calm", "Steady", "Non-demanding", "Give in easily",
        "Avoid confrontations", "Indecisive", "Enjoy routine", "Dislike change", "Warm and relational",
        "Dry humor", "Adaptable", "Supportive", "Thoughtful", "Nurturing", "Patient", "Tolerant",
        "Good listener", "Peace maker"
      ]
    }
  ],

  eqScales: [
    {
      key: "interpersonal",
      title: "Interpersonal Skills",
      questions: [
        "I feel secure of myself in most situations.",
        "I lack self-confidence.",
        "I have good self-respect.",
        "I don't feel good about myself.",
        "It's hard for me to accept myself just the way I am.",
        "I'm happy with the type of person I am.",
        "I feel comfortable with my body.",
        "I'm happy with the way I look.",
        "Looking at both my good points and bad points, I feel good about myself."
      ]
    },
    {
      key: "actualization",
      title: "Self-Actualization",
      questions: [
        "I try to make my life as meaningful as I can.",
        "I really don't know what I'm good at.",
        "In the past few years, I've accomplished little.",
        "I don't get enjoyment from what I do.",
        "I don't get excited about my interests.",
        "I try to continue and develop those things that I enjoy.",
        "I enjoy those things that interest me.",
        "I try to get as much as I can out of those things that I enjoy.",
        "I don't have a good idea of what I want to do in life."
      ]
    },
    {
      key: "responsibility",
      title: "Social Responsibility",
      questions: [
        "I like helping people.",
        "It doesn't bother me to take advantage of other people.",
        "Others find it hard to depend on me.",
        "I care what happens to other people.",
        "If I could get away with breaking the law in certain situations, I would.",
        "I'm respectful to others.",
        "I think it's important to be a law-abiding citizen.",
        "It's hard for me to see other people suffer.",
        "I would stop and help others when they need help."
      ]
    },
    {
      key: "impulse",
      title: "Impulse Control",
      questions: [
        "I know how to deal with upsetting problems.",
        "I believe that I can stay on through tough situations.",
        "I can handle stress without getting too nervous.",
        "I don't hold up well under stress.",
        "I feel that it's too hard for me to control my anxiety.",
        "I know how to keep calm in difficult situations.",
        "It's hard for me to face unpleasant things.",
        "I believe in my ability to handle most upsetting problems.",
        "I get anxious."
      ]
    },
    {
      key: "reality",
      title: "Reality Testing",
      questions: [
        "I try to see things as they really are, without fantasizing or daydreaming.",
        "It's hard for me to understand the way I feel.",
        "I have had strange experiences that can't be explained.",
        "People don't understand the way I think.",
        "I tend to fade out and lose contact with what happens around me.",
        "I get carried away with my imagination and fantasies.",
        "Even when upset, I'm aware of what's happening to me.",
        "I tend to exaggerate.",
        "I can easily pull out of daydreams and tune into the reality of the immediate situation."
      ]
    }
  ],

  eqOptions: [
    { value: 5, label: "Strongly Disagree" },
    { value: 4, label: "Somewhat Disagree" },
    { value: 3, label: "No Opinion" },
    { value: 2, label: "Somewhat Agree" },
    { value: 1, label: "Strongly Agree" }
  ],

  eqScoreBands: [
    { min: 0,  max: 15, rating: "EXCELLENT", note: "Effectively Functioning" },
    { min: 16, max: 30, rating: "GOOD",      note: "Functioning" },
    { min: 31, max: 45, rating: "POOR",      note: "Needs Improvement" }
  ],

  eqInterpret: function (score) {
    for (var i = 0; i < this.eqScoreBands.length; i++) {
      var b = this.eqScoreBands[i];
      if (score >= b.min && score <= b.max) return b;
    }
    return this.eqScoreBands[2];
  },

  temperamentInterpret: function (count) {
    if (count >= 15) return { level: "Strong", color: "#0f766e" };
    if (count >= 10) return { level: "Moderate", color: "#b45309" };
    if (count >= 5) return { level: "Mild", color: "#1d4ed8" };
    return { level: "Minimal", color: "#64748b" };
  },

  now: function () {
    var d = new Date();
    return d.toISOString().slice(0, 10);
  }
};
