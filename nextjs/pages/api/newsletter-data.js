const mainArticleTitles = [
    'The monthly meeting rocked', 'Quarterly review exceeds expectations',
    'Team building event brings everyone together', 'New office policies announced',
    'Company picnic scheduled for next month',
];
const mainArticleContents = [
    'As with (almost) every last Friday of the month, we had our typical monthly meeting with the entire team. We received the sad news that, this month, the sales target — probably — will not be met. It was also announced that our 30th branch will open next month.',
    'The quarterly numbers are in and they show remarkable progress across all departments. Employee satisfaction surveys indicate a 15% improvement over last quarter.',
    "Last Friday's team building activities brought together employees from all departments for a day of collaboration and fun. The escape room challenge was won by the marketing team.",
    'Management has announced several new policies aimed at improving work-life balance. The new flexible working hours policy will take effect next month.',
    'Save the date! Our annual company picnic has been scheduled for the last Saturday of next month. There will be games, food, and prizes for the whole family.',
];
const leftColumnTitles = ['"We want broccoli pie!"', '"Coffee machine needs fixing!"', '"More parking spaces needed!"', '"Bring back pizza Fridays!"', '"Office temperature too cold!"'];
const leftColumnContents = [
    "Popular outcry was not silenced. But the broccoli pie protest came to a sad end. Instead of the broccoli pie, the delivery lady brought chicken pie. The team's vegans were disappointed.",
    "The office coffee machine has been acting up again, producing 'brown water' instead of coffee. Facilities management has promised a replacement by next week.",
    'With the recent hiring spree, the parking lot has become a battleground. Management is considering renting additional spaces across the street.',
    'The beloved pizza Friday tradition was discontinued last month due to budget constraints. A petition with over 200 signatures has been submitted.',
    "The thermostat wars continue as employees bundle up in winter coats. The facilities team claims the temperature is 'optimal.'",
];
const jokes = [
    { setup: 'At the cinema box office:', lines: ['— Two tickets, please.', '— Is it for Romeo and Juliet?', "— No, it's for me and my girlfriend."] },
    { setup: 'At the office printer:', lines: ['— Why won\'t this print?', '— Did you try turning it off and on?', '— Yes, my computer is working fine.'] },
    { setup: 'In the break room:', lines: ['— Is the coffee fresh?', '— Define fresh.', '— Made this century?'] },
];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randDate() { return `${rand(days)}, ${rand(months)} ${Math.floor(Math.random() * 28) + 1}, 2014`; }

export default function handler(req, res) {
    const joke = rand(jokes);
    res.json({
        header: { edition: `Edition nº ${Math.floor(Math.random() * 100) + 1}`, date: randDate() },
        title: 'Old County Times',
        mainArticle: { title: rand(mainArticleTitles), content: rand(mainArticleContents), imageCaption: `Photo of the online call via Google Meet held on Friday, ${randDate()}.` },
        leftColumn: { title: rand(leftColumnTitles), content: rand(leftColumnContents) },
        rightColumn: { title: 'Joke of the month', content: joke.setup, jokeLines: joke.lines, note: 'Note: For contributions to the jokes column, send your suggestion to humor@ourcompany.com.br (we will need it).' },
        comicSection: { title: 'Comic strip of the month', caption: 'Caption: Special thanks to Bia Franzoli for their amazing newspaper design inspiration' },
        contributeSection: { title: 'Contribute to Old County Times', paragraphs: ['Tell us about everyday events at the company: we accept reports, images, jokes and whatever else your creativity allows.', 'Note: All contributions will be selected and evaluated by a mediator before entering the next edition.'] },
    });
}
