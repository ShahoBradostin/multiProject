export type Language = "en" | "sv";

const translations = {
  en: {
    common: {
      backHome: "← Back home",
    },
    nav: {
      about: "About",
      contact: "Contact",
      home: "Home",
      switchLanguage: "Switch language",
    },
    footer: {
      rights: "All rights reserved.",
      email: "Email",
      tagline: "A small collection of things I'm building.",
      navHeading: "Navigate",
      projectsHeading: "Projects",
      socialHeading: "Social",
      moreComingSoon: "More coming soon",
    },
    home: {
      tagline: "A small collection of things I'm building.",
      featured: "Featured",
      kanbanTitle: "Kanban Board",
      kanbanDescription: "Drag cards between To Do, In Progress, and Done.",
      openBoard: "Open board",
      newTag: "New",
      caloriesTitle: "Calorie Tracker",
      caloriesDescription:
        "Log meals and watch calories, protein, and carbs add up for the day.",
      openTracker: "Open tracker",
      comingSoon: "Coming soon",
      projectPlaceholder: "Project {n}",
      placeholderDescription: "Placeholder for a future project.",
    },
    board: {
      title: "Kanban Board",
      description:
        "A kanban board is a simple way to track work as it moves through stages: each task gets a card, and each column marks where it stands. Add a card under To Do, drag it into In Progress once you're on it, and into Done when it's wrapped. Delete what you don't need, and everything sticks around, quietly saved to a JSON file on the backend.",
      loading: "Loading board…",
      newCardHeading: "New card",
      cardTitlePlaceholder: "Card title",
      addCard: "Add card",
      columnAria: "Column",
      priorityAria: "Priority",
      clickToEdit: "Click to edit",
      deleteCard: "Delete {title}",
      backendError:
        "Could not reach the backend. Make sure it's running at {url}",
      addCardError: "Couldn't add the card. Is the backend running?",
      updateCardError: "Couldn't update the card. Is the backend running?",
      deleteCardError: "Couldn't delete the card. Is the backend running?",
      columns: {
        todo: "To Do",
        "in-progress": "In Progress",
        done: "Done",
      },
      priorities: {
        low: "Low",
        medium: "Medium",
        high: "High",
      },
    },
    calories: {
      title: "Calorie Tracker",
      description:
        "Log what you eat with its calories, protein, and carbs, and watch the totals add up for the day.",
      loading: "Loading entries…",
      totalsCalories: "Calories",
      totalsProtein: "Protein",
      totalsCarbs: "Carbs",
      formNameLabel: "What did you eat?",
      formNamePlaceholder: "e.g. Oatmeal",
      formCaloriesLabel: "Calories",
      formProteinLabel: "Protein (g)",
      formCarbsLabel: "Carbs (g)",
      addButton: "Add",
      emptyToday: "Nothing logged yet today. Add your first entry above.",
      calSuffix: "cal",
      proteinSuffix: "g protein",
      carbsSuffix: "g carbs",
      deleteEntry: "Delete {name}",
      backendError:
        "Could not reach the backend. Make sure it's running at {url}",
      addEntryError: "Couldn't log that entry. Is the backend running?",
      deleteEntryError: "Couldn't delete the entry. Is the backend running?",
    },
    foodSearch: {
      heading: "Find a food",
      placeholder: "Search foods…",
      helper:
        "Searching a small built-in list for now. A real food database is coming later. Click a result to fill in the form.",
      noMatches: "No matches. Try a different search.",
      calSuffix: "cal",
      proteinSuffix: "g P",
      carbsSuffix: "g C",
    },
    contact: {
      heading: "Contact Me",
      description:
        "Have a question or just want to say hi? Fill this in, and it'll open your email client with everything ready to send.",
      nameLabel: "Your name",
      namePlaceholder: "Jane Doe",
      emailLabel: "Your email",
      emailPlaceholder: "jane@example.com",
      messageLabel: "Message",
      messagePlaceholder: "What's on your mind?",
      submit: "Send message",
      subject: "Message from {name}",
    },
  },
  sv: {
    common: {
      backHome: "← Tillbaka",
    },
    nav: {
      about: "Om",
      contact: "Kontakt",
      home: "Hem",
      switchLanguage: "Byt språk",
    },
    footer: {
      rights: "Alla rättigheter förbehållna.",
      email: "E-post",
      tagline: "En liten samling saker jag bygger.",
      navHeading: "Navigera",
      projectsHeading: "Projekt",
      socialHeading: "Socialt",
      moreComingSoon: "Fler kommer snart",
    },
    home: {
      tagline: "En liten samling saker jag bygger.",
      featured: "Utvald",
      kanbanTitle: "Kanban-tavla",
      kanbanDescription: "Dra kort mellan Att göra, Pågår och Klart.",
      openBoard: "Öppna tavlan",
      newTag: "Nytt",
      caloriesTitle: "Kaloriräknare",
      caloriesDescription:
        "Logga måltider och se kalorier, protein och kolhydrater summeras för dagen.",
      openTracker: "Öppna räknaren",
      comingSoon: "Kommer snart",
      projectPlaceholder: "Projekt {n}",
      placeholderDescription: "Platshållare för ett framtida projekt.",
    },
    board: {
      title: "Kanban-tavla",
      description:
        "En kanban-tavla är ett enkelt sätt att följa arbete genom olika steg: varje uppgift får ett kort, och varje kolumn visar var det står. Lägg till ett kort under Att göra, dra det till Pågår när du börjar med det, och till Klart när det är avslutat. Ta bort det du inte behöver, och allt sparas tyst till en JSON-fil på backend.",
      loading: "Laddar tavlan…",
      newCardHeading: "Nytt kort",
      cardTitlePlaceholder: "Korttitel",
      addCard: "Lägg till kort",
      columnAria: "Kolumn",
      priorityAria: "Prioritet",
      clickToEdit: "Klicka för att redigera",
      deleteCard: "Ta bort {title}",
      backendError: "Kunde inte nå backend. Kontrollera att den körs på {url}",
      addCardError: "Kunde inte lägga till kortet. Körs backend?",
      updateCardError: "Kunde inte uppdatera kortet. Körs backend?",
      deleteCardError: "Kunde inte ta bort kortet. Körs backend?",
      columns: {
        todo: "Att göra",
        "in-progress": "Pågår",
        done: "Klart",
      },
      priorities: {
        low: "Låg",
        medium: "Medel",
        high: "Hög",
      },
    },
    calories: {
      title: "Kaloriräknare",
      description:
        "Logga det du äter med kalorier, protein och kolhydrater, och se summan växa för dagen.",
      loading: "Laddar poster…",
      totalsCalories: "Kalorier",
      totalsProtein: "Protein",
      totalsCarbs: "Kolhydrater",
      formNameLabel: "Vad åt du?",
      formNamePlaceholder: "t.ex. Havregrynsgröt",
      formCaloriesLabel: "Kalorier",
      formProteinLabel: "Protein (g)",
      formCarbsLabel: "Kolhydrater (g)",
      addButton: "Lägg till",
      emptyToday: "Inget loggat idag än. Lägg till din första post ovan.",
      calSuffix: "kal",
      proteinSuffix: "g protein",
      carbsSuffix: "g kolhydrater",
      deleteEntry: "Ta bort {name}",
      backendError: "Kunde inte nå backend. Kontrollera att den körs på {url}",
      addEntryError: "Kunde inte logga posten. Körs backend?",
      deleteEntryError: "Kunde inte ta bort posten. Körs backend?",
    },
    foodSearch: {
      heading: "Hitta mat",
      placeholder: "Sök efter mat…",
      helper:
        "Söker i en liten inbyggd lista för tillfället. En riktig matdatabas kommer senare. Klicka på ett resultat för att fylla i formuläret.",
      noMatches: "Inga träffar. Prova en annan sökning.",
      calSuffix: "kal",
      proteinSuffix: "g P",
      carbsSuffix: "g K",
    },
    contact: {
      heading: "Kontakta mig",
      description:
        "Har du en fråga eller vill bara säga hej? Fyll i det här, så öppnas din e-postklient med allt klart att skicka.",
      nameLabel: "Ditt namn",
      namePlaceholder: "Jane Doe",
      emailLabel: "Din e-post",
      emailPlaceholder: "jane@example.com",
      messageLabel: "Meddelande",
      messagePlaceholder: "Vad tänker du på?",
      submit: "Skicka meddelande",
      subject: "Meddelande från {name}",
    },
  },
} satisfies Record<Language, unknown>;

export function translate(
  language: Language,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const path = key.split(".");
  let node: unknown = translations[language];
  for (const segment of path) {
    if (typeof node !== "object" || node === null) return key;
    node = (node as Record<string, unknown>)[segment];
  }
  if (typeof node !== "string") return key;
  if (!vars) return node;
  return node.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
