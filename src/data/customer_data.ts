export interface Customer {
    id: string;
    name: string;
    email : string;
    status : "active" | "inactive" | "suspended";
    plan : "free" | "scale" | "enterprise";
    company : string;
    createdAt: string;
    lastLoginAt : string;
    totalSpent : number;
}

export const customers: Customer[] = [
  { id: "cust_001", name: "Marie Dupont", email: "marie.dupont@qonto.com", status: "active", plan: "enterprise", company: "Qonto", createdAt: "2021-03-14", lastLoginAt: "2026-02-15", totalSpent: 48500 },
  { id: "cust_002", name: "Jan de Vries", email: "jan.devries@swanio.com", status: "active", plan: "enterprise", company: "Swan.io", createdAt: "2022-01-08", lastLoginAt: "2026-02-14", totalSpent: 36200 },
  { id: "cust_003", name: "Lucia Fernández", email: "lucia@creditagricole.fr", status: "active", plan: "enterprise", company: "Crédit Agricole", createdAt: "2020-11-22", lastLoginAt: "2026-02-16", totalSpent: 124000 },
  { id: "cust_004", name: "Thomas Müller", email: "t.muller@finleap.com", status: "active", plan: "scale", company: "Finleap", createdAt: "2023-06-01", lastLoginAt: "2026-02-10", totalSpent: 5760 },
  { id: "cust_005", name: "Sophie Laurent", email: "sophie@alan.com", status: "inactive", plan: "scale", company: "Alan", createdAt: "2022-09-15", lastLoginAt: "2025-08-20", totalSpent: 8640 },
  { id: "cust_006", name: "Pedro Santos", email: "pedro.santos@talkdesk.com", status: "active", plan: "enterprise", company: "Talkdesk", createdAt: "2021-07-30", lastLoginAt: "2026-02-13", totalSpent: 62400 },
  { id: "cust_007", name: "Emma Johansson", email: "emma.j@klarna.com", status: "suspended", plan: "enterprise", company: "Klarna", createdAt: "2021-02-18", lastLoginAt: "2025-11-05", totalSpent: 41300 },
  { id: "cust_008", name: "Antoine Moreau", email: "a.moreau@pennylane.com", status: "active", plan: "scale", company: "Pennylane", createdAt: "2023-04-12", lastLoginAt: "2026-02-15", totalSpent: 4320 },
  { id: "cust_009", name: "Katja Weber", email: "katja@n26.com", status: "active", plan: "enterprise", company: "N26", createdAt: "2020-08-05", lastLoginAt: "2026-02-16", totalSpent: 87600 },
  { id: "cust_010", name: "Liam O'Brien", email: "liam@intercom.com", status: "active", plan: "scale", company: "Intercom", createdAt: "2023-01-20", lastLoginAt: "2026-02-11", totalSpent: 6480 },
  { id: "cust_011", name: "Chloé Martin", email: "chloe.martin@doctolib.fr", status: "active", plan: "enterprise", company: "Doctolib", createdAt: "2021-05-09", lastLoginAt: "2026-02-14", totalSpent: 55200 },
  { id: "cust_012", name: "Marco Rossi", email: "m.rossi@nexi.it", status: "inactive", plan: "scale", company: "Nexi", createdAt: "2022-12-03", lastLoginAt: "2025-06-18", totalSpent: 7200 },
  { id: "cust_013", name: "Ingrid Larsen", email: "ingrid@vipps.no", status: "active", plan: "enterprise", company: "Vipps", createdAt: "2021-10-27", lastLoginAt: "2026-02-12", totalSpent: 43800 },
  { id: "cust_014", name: "Hugo Petit", email: "hugo@lydia-app.com", status: "suspended", plan: "scale", company: "Lydia", createdAt: "2023-03-15", lastLoginAt: "2025-09-30", totalSpent: 2880 },
  { id: "cust_015", name: "Elena Popov", email: "elena.p@revolut.com", status: "active", plan: "enterprise", company: "Revolut", createdAt: "2020-06-11", lastLoginAt: "2026-02-16", totalSpent: 96000 },
  { id: "cust_016", name: "François Leroy", email: "f.leroy@spendesk.com", status: "active", plan: "scale", company: "Spendesk", createdAt: "2023-08-22", lastLoginAt: "2026-02-09", totalSpent: 3840 },
  { id: "cust_017", name: "Anna Kowalski", email: "anna.k@allegro.pl", status: "active", plan: "enterprise", company: "Allegro", createdAt: "2021-12-14", lastLoginAt: "2026-02-15", totalSpent: 52800 },
  { id: "cust_018", name: "Dieter Schmidt", email: "d.schmidt@wefox.com", status: "inactive", plan: "scale", company: "Wefox", createdAt: "2022-07-19", lastLoginAt: "2025-04-12", totalSpent: 5040 },
  { id: "cust_019", name: "Camille Dubois", email: "camille@payfit.com", status: "active", plan: "enterprise", company: "PayFit", createdAt: "2021-01-25", lastLoginAt: "2026-02-13", totalSpent: 67200 },
  { id: "cust_020", name: "Niels Andersen", email: "niels@lunar.app", status: "active", plan: "scale", company: "Lunar", createdAt: "2023-05-30", lastLoginAt: "2026-02-08", totalSpent: 4080 },
  { id: "cust_021", name: "Isabel García", email: "isabel@cabify.com", status: "suspended", plan: "scale", company: "Cabify", createdAt: "2022-04-07", lastLoginAt: "2025-10-22", totalSpent: 6120 },
  { id: "cust_022", name: "Pierre Blanc", email: "p.blanc@akeneo.com", status: "active", plan: "scale", company: "Akeneo", createdAt: "2023-02-14", lastLoginAt: "2026-02-14", totalSpent: 5280 },
  { id: "cust_023", name: "Marta Nowak", email: "marta@booksy.com", status: "active", plan: "scale", company: "Booksy", createdAt: "2023-07-11", lastLoginAt: "2026-02-07", totalSpent: 3360 },
  { id: "cust_024", name: "Erik Lindqvist", email: "erik@tink.com", status: "active", plan: "enterprise", company: "Tink", createdAt: "2021-04-03", lastLoginAt: "2026-02-16", totalSpent: 58800 },
  { id: "cust_025", name: "Julien Roche", email: "julien@mangopay.com", status: "active", plan: "enterprise", company: "Mangopay", createdAt: "2020-09-17", lastLoginAt: "2026-02-15", totalSpent: 79200 },
  { id: "cust_026", name: "Clara Hoffmann", email: "clara@contentful.com", status: "inactive", plan: "enterprise", company: "Contentful", createdAt: "2021-08-29", lastLoginAt: "2025-07-14", totalSpent: 38400 },
  { id: "cust_027", name: "Rui Almeida", email: "rui@feedzai.com", status: "active", plan: "enterprise", company: "Feedzai", createdAt: "2021-06-20", lastLoginAt: "2026-02-12", totalSpent: 45600 },
  { id: "cust_028", name: "Amélie Girard", email: "amelie@swile.co", status: "active", plan: "scale", company: "Swile", createdAt: "2023-09-05", lastLoginAt: "2026-02-10", totalSpent: 3120 },
  { id: "cust_029", name: "Florian Bauer", email: "f.bauer@personio.de", status: "active", plan: "enterprise", company: "Personio", createdAt: "2020-12-08", lastLoginAt: "2026-02-16", totalSpent: 91200 },
  { id: "cust_030", name: "Nadia Bergström", email: "nadia@trustly.com", status: "active", plan: "scale", company: "Trustly", createdAt: "2023-10-18", lastLoginAt: "2026-02-06", totalSpent: 2640 },
  { id: "cust_031", name: "Olivier Faure", email: "o.faure@mirakl.com", status: "active", plan: "enterprise", company: "Mirakl", createdAt: "2021-09-13", lastLoginAt: "2026-02-14", totalSpent: 50400 },
  { id: "cust_032", name: "Lena Fischer", email: "lena@scalable.capital", status: "suspended", plan: "scale", company: "Scalable Capital", createdAt: "2022-11-25", lastLoginAt: "2025-12-01", totalSpent: 4560 },
  { id: "cust_033", name: "Matteo Conti", email: "matteo@satispay.com", status: "active", plan: "scale", company: "Satispay", createdAt: "2023-06-28", lastLoginAt: "2026-02-11", totalSpent: 3600 },
  { id: "cust_034", name: "Sarah O'Connor", email: "sarah@stripe-eu.com", status: "active", plan: "enterprise", company: "Stripe EU", createdAt: "2020-04-15", lastLoginAt: "2026-02-16", totalSpent: 132000 },
  { id: "cust_035", name: "Henrik Dahl", email: "henrik@pleo.io", status: "active", plan: "scale", company: "Pleo", createdAt: "2023-01-09", lastLoginAt: "2026-02-13", totalSpent: 5520 },
  { id: "cust_036", name: "Valérie Morel", email: "valerie@algolia.com", status: "active", plan: "enterprise", company: "Algolia", createdAt: "2021-03-22", lastLoginAt: "2026-02-15", totalSpent: 61200 },
  { id: "cust_037", name: "Piotr Zielinski", email: "piotr@docplanner.com", status: "active", plan: "scale", company: "DocPlanner", createdAt: "2022-10-14", lastLoginAt: "2026-02-09", totalSpent: 6960 },
  { id: "cust_038", name: "Astrid Nielsen", email: "astrid@vivino.com", status: "inactive", plan: "scale", company: "Vivino", createdAt: "2022-05-31", lastLoginAt: "2025-03-20", totalSpent: 4800 },
  { id: "cust_039", name: "Baptiste Renaud", email: "baptiste@qare.fr", status: "active", plan: "scale", company: "Qare", createdAt: "2023-11-02", lastLoginAt: "2026-02-07", totalSpent: 1920 },
  { id: "cust_040", name: "Julia Eriksson", email: "julia@anyfin.com", status: "active", plan: "scale", company: "Anyfin", createdAt: "2023-04-25", lastLoginAt: "2026-02-12", totalSpent: 4080 },
  { id: "cust_041", name: "Raphaël Mercier", email: "raphael@ledger.com", status: "active", plan: "enterprise", company: "Ledger", createdAt: "2021-07-16", lastLoginAt: "2026-02-14", totalSpent: 48000 },
  { id: "cust_042", name: "Hanna Virtanen", email: "hanna@wolt.com", status: "active", plan: "enterprise", company: "Wolt", createdAt: "2021-11-08", lastLoginAt: "2026-02-15", totalSpent: 54000 },
  { id: "cust_043", name: "Carlos Ruiz", email: "carlos@flywire.com", status: "active", plan: "scale", company: "Flywire", createdAt: "2023-08-14", lastLoginAt: "2026-02-10", totalSpent: 3360 },
  { id: "cust_044", name: "Louise Bernard", email: "louise@contentsquare.com", status: "active", plan: "enterprise", company: "Contentsquare", createdAt: "2020-10-30", lastLoginAt: "2026-02-16", totalSpent: 84000 },
  { id: "cust_045", name: "Stefan Gruber", email: "stefan@bitpanda.com", status: "suspended", plan: "scale", company: "Bitpanda", createdAt: "2022-08-19", lastLoginAt: "2025-11-28", totalSpent: 5760 },
  { id: "cust_046", name: "Émilie Fontaine", email: "emilie@younited.com", status: "active", plan: "scale", company: "Younited Credit", createdAt: "2023-02-28", lastLoginAt: "2026-02-11", totalSpent: 5040 },
  { id: "cust_047", name: "Lars Henriksen", email: "lars@spiio.com", status: "inactive", plan: "free", company: "Spiio", createdAt: "2024-01-15", lastLoginAt: "2025-05-10", totalSpent: 0 },
  { id: "cust_048", name: "Margaux Chevalier", email: "margaux@datadog.eu", status: "active", plan: "enterprise", company: "Datadog EU", createdAt: "2020-07-22", lastLoginAt: "2026-02-16", totalSpent: 108000 },
  { id: "cust_049", name: "Tomás Ferreira", email: "tomas@unbabel.com", status: "active", plan: "scale", company: "Unbabel", createdAt: "2023-05-17", lastLoginAt: "2026-02-08", totalSpent: 4320 },
  { id: "cust_050", name: "Céline Arnaud", email: "celine@backmarket.com", status: "active", plan: "enterprise", company: "Back Market", createdAt: "2021-02-10", lastLoginAt: "2026-02-15", totalSpent: 72000 },
];