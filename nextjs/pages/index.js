import Head from 'next/head';

const heroImages = [
    'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
];
const comicImages = ['/img/001.jpg', '/img/002.jpg', '/img/003.jpg', '/img/004.jpg', '/img/005.jpg'];

const mainArticleTitles = [
    'The monthly meeting rocked',
    'Quarterly review exceeds expectations',
    'Team building event brings everyone together',
    'New office policies announced',
    'Company picnic scheduled for next month',
];
const mainArticleContents = [
    'As with (almost) every last Friday of the month, we had our typical monthly meeting with the entire team. We received the sad news that, this month, the sales target — probably — will not be met. It was also announced that our 30th branch will open next month. Our CEO announced that with the arrival of the 50 new employees, the amount of coffee consumed increased slightly.',
    'The quarterly numbers are in and they show remarkable progress across all departments. Employee satisfaction surveys indicate a 15% improvement over last quarter. The new coffee machine in the break room has been particularly well-received by the team.',
    "Last Friday's team building activities brought together employees from all departments for a day of collaboration and fun. The escape room challenge was won by the marketing team, while the accounting department dominated the trivia contest.",
    'Management has announced several new policies aimed at improving work-life balance. The new flexible working hours policy will take effect next month, along with the introduction of casual Fridays.',
    'Save the date! Our annual company picnic has been scheduled for the last Saturday of next month. There will be games, food, and prizes for the whole family. RSVP deadline is two weeks from today.',
];
const leftColumnTitles = [
    '"We want broccoli pie!"',
    '"Coffee machine needs fixing!"',
    '"More parking spaces needed!"',
    '"Bring back pizza Fridays!"',
    '"Office temperature too cold!"',
];
const leftColumnContents = [
    "Popular outcry was not silenced. But the broccoli pie protest came to a sad end. Informants claim that the result of the party at the office last Friday (26) was not friendly at all. Instead of the broccoli pie, the delivery lady brought chicken pie. The team's vegans, who currently make up 95% of the people, were disappointed.",
    "The office coffee machine has been acting up again, producing what can only be described as 'brown water' instead of coffee. Facilities management has promised a replacement by next week, but employees remain skeptical.",
    'With the recent hiring spree, the parking lot has become a battleground. Employees are arriving earlier just to secure a spot. Management is considering renting additional spaces across the street.',
    'The beloved pizza Friday tradition was discontinued last month due to budget constraints. A petition with over 200 signatures has been submitted to management requesting its return.',
    "The ongoing thermostat wars continue as employees bundle up in winter coats while working. The facilities team claims the temperature is 'optimal,' but the evidence suggests otherwise.",
];
const jokes = [
    { setup: 'At the cinema box office:', lines: ['— Two tickets, please.', '— Is it for Romeo and Juliet?', '— No, it\'s for me and my girlfriend.'] },
    { setup: 'At the office printer:', lines: ['— Why won\'t this print?', '— Did you try turning it off and on?', '— Yes, my computer is working fine.'] },
    { setup: 'In the break room:', lines: ['— Is the coffee fresh?', '— Define fresh.', '— Made this century?'] },
];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randDate() { return `${rand(days)}, ${rand(months)} ${Math.floor(Math.random() * 28) + 1}, 2014`; }

export function getServerSideProps() {
    const joke = rand(jokes);
    return {
        props: {
            edition: `Edition nº ${Math.floor(Math.random() * 100) + 1}`,
            date: randDate(),
            mainArticle: { title: rand(mainArticleTitles), content: rand(mainArticleContents), imageCaption: `Photo of the online call via Google Meet held on Friday, ${randDate()}.` },
            leftColumn: { title: rand(leftColumnTitles), content: rand(leftColumnContents) },
            rightColumn: { content: joke.setup, lines: joke.lines },
            hero: rand(heroImages),
            comic: rand(comicImages),
        },
    };
}

export default function Home({ edition, date, mainArticle, leftColumn, rightColumn, hero, comic }) {
    return (
        <>
            <Head><title>Old County Times</title></Head>
            <div className="newsletter">
                <div className="header">
                    <div>{edition}</div>
                    <div>{date}</div>
                </div>

                <hr />
                <h1 className="title">Old County Times</h1>
                <hr />

                <h2>{mainArticle.title}</h2>
                <p>{mainArticle.content}</p>
                <img src={hero} alt="Company meeting" className="meeting-photo" />
                <div className="caption">{mainArticle.imageCaption}</div>

                <hr />

                <div className="two-column">
                    <div className="column">
                        <h2>{leftColumn.title}</h2>
                        <p>{leftColumn.content}</p>
                    </div>
                    <div className="column">
                        <h2>Joke of the month</h2>
                        <p>{rightColumn.content}</p>
                        <div className="joke-lines">
                            {rightColumn.lines.map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                        <p className="note">Note: For contributions to the jokes column, send your suggestion to humor@ourcompany.com.br (we will need it).</p>
                    </div>
                </div>

                <hr />

                <h2>Comic strip of the month</h2>
                <img src={comic} alt="Comic strip of the month" className="comic-strip" />
                <div className="comic-caption">Caption: Special thanks to Bia Franzoli for their amazing newspaper design inspiration</div>

                <hr />

                <div className="contribute">
                    <h2>Contribute to Old County Times</h2>
                    <p>Tell us about everyday events at the company: we accept reports, images, jokes and whatever else your creativity allows. Share with us the achievements and defeats in your area so that we can always be together on this journey.</p>
                    <p>Note: All contributions will be selected and evaluated by a mediator before entering the next edition.</p>
                </div>
            </div>
        </>
    );
}
