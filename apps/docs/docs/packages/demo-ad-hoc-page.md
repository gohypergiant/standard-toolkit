# Demo

See the [docusaurus docs](https://docusaurus.io/docs/markdown-features) for full feature set.

## general markdown bidniz

|table|demo|
|-|-|
|sweet|potato|

1. yay
1. cool
1. wowee
1. very awesome nice

## code sample

```ts title="highlight demo" showLineNumbers
// some other thing and stuff
// some other thing and stuff
// highlight-next-line
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
// some other thing and stuff
// some other thing and stuff
// some other thing and stuff
```

## live playground

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