# Constants


1. yay
1. cool
1. wowee

```ts title="highlight demo" showLineNumbers
// some other thing and stuff
// some other thing and stuff
// highlight-next-line
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
// some other thing and stuff
// some other thing and stuff
// some other thing and stuff
```

```jsx live
function Clock(props) {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}
```
