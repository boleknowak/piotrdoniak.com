export default function handler(req, res) {
  fetch('https://piotrdoniak.com', {
    method: 'GET',
  });

  res.status(200).end('Hello Cron!');
}
