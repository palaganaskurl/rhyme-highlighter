import { useMemo, useRef, useState } from 'react';
import './App.css';
import Timeline from './Timeline';
import { Player, PlayerRef } from '@remotion/player';
import { Item, RemotionTrack } from './types';
import { Main } from './Remotion';
import { filteredWordDataRaw } from './data';
import { FPS } from './constants';
import TextEditor from './TextEditor';

function App() {
  const wordsWithTimestamps = filteredWordDataRaw
    .map((word) => {
      return {
        word: word.value,
        timestamp: word.ts * FPS, // Assuming each word is 30 frames long
        durationInFrames: (word.end_ts - word.ts) * FPS
      };
    })
    .slice(0, 100); // Limit to 10 words for testing

  const texts = wordsWithTimestamps.map((word) => {
    return {
      type: 'text',
      text: word.word,
      durationInFrames: word.durationInFrames,
      from: word.timestamp
    };
  });

  const [tracks, setTracks] = useState<RemotionTrack[]>([
    {
      name: 'Track 1',
      items: texts as Item[]
    },
    {
      name: 'Track 2',
      items: [
        {
          type: 'audio',
          src: 'http://localhost:5173/test.mp3'
        } as Item
      ]
    },
    {
      name: 'Track 3',
      items: [
        {
          type: 'highlightedVerses',
          wordsWithTimestamps: wordsWithTimestamps
        } as Item
      ]
    }
  ]);

  const inputProps = useMemo(() => {
    return {
      tracks
    };
  }, [tracks]);

  const playerRef = useRef<PlayerRef>(null);

  return (
    <>
      <div className="grid grid-cols-3">
        <div className="flex flex-col">
          <div className="flex justify-center">Lyrics</div>
          <textarea
            className="textarea w-full"
            placeholder="Bio"
            rows={20}
            defaultValue={`[Chorus]
My niggas be smokin' on something loud, head to the clouds
I ain't been steppin' out, tired of stickin' out in the crowd
This world is changin' right in front of me
Gray hairs, I'm agin' quicker than I thought I'd be

[Refrain]
Straight up (Straight up, straight up, straight up, straight up, straight up)
Straight up (Straight up, straight up, straight up, straight up, straight up)
Straight up (Straight up, straight up, straight up, straight up, straight up)
Straight up (Straight up, straight up, straight up, straight up, straight up)

[Verse 1]
Please believe these flows teach egos
To freeze and then recede, I'm C4
Beneath your Jeep, the second you turn that keyhole
Then heat blows your weak flows right out the water
The father, boy, I work smarter and harder
My style got a restraining order, don't bothеr
I charter unseen territories in ordеr
To push it farther than you niggas had ever thought of
I caught a lotta murder charges, turned artists to martyrs
When I rock, thot turns to goddess
Fiends turn to kings, dreams turn to things tangible
My hands are full with grands I pulled
From stanzas, no, I can't go slow, I'm Sandra Bull'
Either proceed with speed or don't breathe
There's no creed or color that won't heed to the warning
The planet'll shake when I'm performing
Tectonic plates from a place where TECs on they waist
So stay safe or get left with chest on your face
As death waits for your last of breath
I'ma pass the test, yes, I'm a master chef
Want a taste, then pay for it
They claim they're real, but they're seldom straightforward
The pain I feel on my frame gets transmuted to a dangerous flame
I spit fire at the devil while the angels sing
The flow changed, but Jermaine's the same, I'm plain jane
Not a chain on my neck, but shine like baguettes
A shame, not a flex to rhyme like the rest
My mind's quite depressed if I don't write these
I'm Spike Lee of the audio, back in my barrio
Parties got shot up, so I built up on my cardio
Dodge shells, collect coins like I'm Mario
But this is not a gaming experience, I'm serious, nigga
See upcoming rap shows
Get tickets for your favorite artists

You might also like
ExtraL
JENNIE & Doechii
Ms. Whitman
Bhad Bhabie
BACKD00R
Playboi Carti

[Refrain]
Straight up (Straight up, straight up, straight up, straight up, straight up)
Straight up (Straight up, straight up, straight up, straight up, straight up)
Straight up (Straight up, straight up, straight up, straight up, straight up)
Straight up (Straight up, straight up, yeah)

[Chorus]
My niggas be smokin' on something loud, head to the clouds
I ain't been steppin' out, tired of stickin' out in the crowd
This world is changin' right in front of me
Gray hairs, I'm agin' quicker than I thought I'd be

[Verse 2]
I'm that bass in your trunk, the bullet that missed Trump
The gun that jammed 'cause it seemed God had other plans
The Son of Man extendin' his hand to Son of Sam
In forgiveness for all of the homicides we witnessed
The overdramatized, the traumatized with sickness
Thrown in the pan and caramelized for richness
And served on a plate with sirloin steak
To billionaires who don't care the world's gon' break
Long as they make money off it, pain brings profit
One man gains it soon as the next man lost it
There's a bridge you can walk to hear God talk
But there are real slim odds a rich man crosses
'Cause greed is a poisonous seed, indeed
As it spreads like weeds through the mind's apple trees
I proceed with caution, and I'm not flossin'
Unlike some, I'm not defined by my fortune
I'm defined by rhymes, though I'm in my prime
There was times that I was down 'cause I'd thought I'd lost it
But no, lo and behold, as my poetry grows
I give all glory to God as the story unfolds
And the gray hairs that grow on my head will show
Ain't no time limit to get it, you ain't never too old
So keep hold of your dream, no matter how it seems
If you don't water your lawn, well, then it won't stay green
I seen babies turn fiends, addicted to the screen
That dad shares, cashiers replaced by machines
Don't buy, subscribe so you can just stream
Your content like rent, you won't own a thing
Before long, all the songs the whole world sings
Will be generated by latest of AI regimes
As all of our favorite artists erased by it scream
From the wayside, "Ayy, whatever happened to human beings?"


[Refrain]
Straight up, straight up, straight up, straight up, straight up
Straight up, straight up, straight up, straight up, straight up
Straight up, straight up, straight up, straight up, straight up
Straight up, straight up, straight up, straight up, straight up

[Outro]
My niggas be smokin' on something loud`}
          ></textarea>
        </div>
        <div className="flex flex-row items-center justify-center">
          <Player
            style={{
              height: '400px'
            }}
            component={Main}
            fps={30}
            inputProps={inputProps}
            durationInFrames={148 * FPS}
            compositionWidth={1920}
            compositionHeight={1080}
            controls
            ref={playerRef}
            acknowledgeRemotionLicense
          />
        </div>
        <div>
          <TextEditor />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <Timeline tracks={tracks} playerRef={playerRef} />
      </div>
    </>
  );
}

export default App;
