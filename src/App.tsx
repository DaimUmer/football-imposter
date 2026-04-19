import { useState, useRef } from 'react';
import { Users, UserPlus, Play, Eye, Clock, ShieldAlert, Trophy, RotateCcw, X, Check } from 'lucide-react';

interface FootballPlayer {
  name: string;
  photo: string;
  club: string;
  country: string;
  hints: string[];
}

type GameState = 'SETUP' | 'PASS' | 'REVEAL' | 'DISCUSS' | 'END';

const FOOTBALL_PLAYERS: FootballPlayer[] = [
  // === ACTIVE STARS ===
  { name: "Lionel Messi", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg", club: "Inter Miami", country: "🇦🇷", hints: ["False nine", "Silky dribbler", "Left-footed magic", "Iconic rivalry", "Playmaker maestro", "La Liga legend", "Global icon"] },
  { name: "Cristiano Ronaldo", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg", club: "Al Nassr", country: "🇵🇹", hints: ["Clinical finisher", "Iconic celebration", "Aerial threat", "Champions League king", "Iconic rivalry", "Elite mentality", "Record goalscorer"] },
  { name: "Kylian Mbappé", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/2022_FIFA_World_Cup_France_4%E2%80%931_Australia_-_%287%29_%28cropped%29.jpg", club: "Real Madrid", country: "🇫🇷", hints: ["Explosive pace", "Teenage phenomenon", "World champion", "Clinical finisher", "Hat-trick hero", "Ligue 1 icon", "Electric winger"] },
  { name: "Erling Haaland", photo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Erling_Haaland_2023_%28cropped%29.jpg", club: "Manchester City", country: "🇳🇴", hints: ["Physical monster", "Robotic efficiency", "Record goalscorer", "Clinical striker", "Nordic giant", "Premier League star", "Treble winner"] },
  { name: "Neymar Jr", photo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Neymar_Jr._with_Al_Hilal%2C_3_October_2023_-_03_%28cropped%29.jpg", club: "Al Hilal", country: "🇧🇷", hints: ["Silky dribbler", "Showboat", "Iconic trio", "Flair player", "Record transfer", "Olympic gold", "La Liga star"] },
  { name: "Vinicius Jr", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Vinicius_Jr_2021.jpg", club: "Real Madrid", country: "🇧🇷", hints: ["Explosive pace", "Silky dribbler", "Big-game player", "Finals goalscorer", "La Liga star", "Electric winger", "Elite dribbler"] },
  { name: "Lamine Yamal", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Lamine_Yamal_2024.jpg", club: "FC Barcelona", country: "🇪🇸", hints: ["Teenage sensation", "Inverted winger", "Left-footed magic", "Euro winner", "Academy graduate", "La Liga star", "Record breaker"] },
  { name: "Jude Bellingham", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Jude_Bellingham_2023.jpg", club: "Real Madrid", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Box-to-box", "Complete midfielder", "Late winner", "Iconic celebration", "Golden boy", "La Liga star", "Elite mentality"] },
  { name: "Mohamed Salah", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Mohamed_Salah_2018.jpg", club: "Liverpool", country: "🇪🇬", hints: ["Inverted winger", "Left-footed magic", "Premier League icon", "Clinical finisher", "Record breaker", "Pacy attacker", "Champions League winner"] },
  { name: "Kevin De Bruyne", photo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Kevin_De_Bruyne_201807092.jpg", club: "Manchester City", country: "🇧🇪", hints: ["Elite playmaker", "Visionary passing", "Midfield maestro", "Pinpoint crosses", "Premier League icon", "Assist king", "Treble winner"] },
  { name: "Pedri", photo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Pedri_2021_%28cropped%29.jpg", club: "FC Barcelona", country: "🇪🇸", hints: ["Midfield maestro", "Golden Boy", "Silky dribbler", "Iniesta heir", "La Liga star", "Visionary passing", "Academy graduate"] },
  { name: "Phil Foden", photo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Phil_Foden_2022_%28cropped%29.jpg", club: "Manchester City", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Academy graduate", "Left-footed magic", "Premier League star", "Sniper", "Silky dribbler", "Treble winner", "Playmaker maestro"] },
  { name: "Harry Kane", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Harry_Kane_2024.jpg", club: "Bayern Munich", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Complete forward", "Deep-lying striker", "Clinical finisher", "Golden boot", "Premier League icon", "Bundesliga star", "Elite passer"] },
  { name: "Robert Lewandowski", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Robert_Lewandowski_2022_%28cropped%29.jpg", club: "FC Barcelona", country: "🇵🇱", hints: ["Complete number nine", "Clinical finisher", "Five goals quickly", "Bundesliga legend", "Treble winner", "Record goalscorer", "Elite positioning"] },
  { name: "Virgil van Dijk", photo: "https://upload.wikimedia.org/wikipedia/commons/8/81/Virgil_van_Dijk_2018.jpg", club: "Liverpool", country: "🇳🇱", hints: ["Commanding center-back", "Calm presence", "Aerial threat", "Club captain", "Premier League icon", "Elite defender", "Champions League winner"] },
  { name: "Alisson Becker", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Alisson_Becker_2018.jpg", club: "Liverpool", country: "🇧🇷", hints: ["Sweeper keeper", "Elite shot-stopper", "Header goal", "Premier League icon", "Calm presence", "Champions League winner", "One-on-one specialist"] },
  { name: "Thibaut Courtois", photo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Thibaut_Courtois_2018_%28cropped%29.jpg", club: "Real Madrid", country: "🇧🇪", hints: ["Giant goalkeeper", "Champions League winner", "Elite shot-stopper", "Final MVP", "La Liga star", "Reflex saves", "Commanding presence"] },
  { name: "Rodri", photo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Rodri_2023.jpg", club: "Manchester City", country: "🇪🇸", hints: ["Holding midfielder", "Midfield anchor", "Tucked shirt", "Clutch goals", "Treble winner", "Premier League star", "Unbeaten streak"] },
  { name: "Luka Modrić", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Luka_Modric_2018.jpg", club: "Real Madrid", country: "🇭🇷", hints: ["Midfield maestro", "Outside foot pass", "Elite longevity", "La Liga legend", "Ballon d'Or winner", "World Cup finalist", "Champions League king"] },
  { name: "Karim Benzema", photo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Karim_Benzema_2022.jpg", club: "Al Ittihad", country: "🇫🇷", hints: ["Complete forward", "Link-up play", "Clutch player", "Hand bandage", "La Liga legend", "Ballon d'Or winner", "Champions League king"] },
  { name: "Antoine Griezmann", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Antoine_Griezmann_2018.jpg", club: "Atletico Madrid", country: "🇫🇷", hints: ["Second striker", "Defensive workhorse", "World champion", "Video game celebrations", "La Liga star", "Elite playmaker", "Versatile attacker"] },
  { name: "Sadio Mané", photo: "https://upload.wikimedia.org/wikipedia/commons/5/54/Sadio_Man%C3%A9_2019_%28cropped%29.jpg", club: "Al Nassr", country: "🇸🇳", hints: ["Explosive winger", "Premier League legend", "Champions League winner", "Defensive workhorse", "African king", "Pacy attacker", "Dynamic winger"] },
  { name: "Son Heung-min", photo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Son_Heung-min_2022.jpg", club: "Tottenham Hotspur", country: "🇰🇷", hints: ["Two-footed attacker", "Explosive pace", "Puskas winner", "Club captain", "Premier League icon", "Lethal finisher", "Dynamic winger"] },
  { name: "Bukayo Saka", photo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Bukayo_Saka_2022.jpg", club: "Arsenal", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Inverted winger", "Academy graduate", "Left-footed magic", "Premier League star", "Fan favorite", "Silky dribbler", "Dynamic attacker"] },
  { name: "Rúben Dias", photo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/R%C3%BAben_Dias_2022_%28cropped%29.jpg", club: "Manchester City", country: "🇵🇹", hints: ["Commanding center-back", "Treble winner", "Premier League star", "Fearless tackler", "Leader", "Elite defender", "Block specialist"] },
  { name: "Casemiro", photo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Casemiro_2022_%28cropped%29.jpg", club: "Manchester United", country: "🇧🇷", hints: ["Midfield destroyer", "Champions League king", "Premier League star", "Elite tackler", "Tactical foul", "Defensive anchor", "La Liga legend"] },
  { name: "Manuel Neuer", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Manuel_Neuer_2021_%28cropped%29.jpg", club: "Bayern Munich", country: "🇩🇪", hints: ["Sweeper keeper", "Bundesliga legend", "World champion", "Elite distribution", "Wall", "Modern era", "Shot-stopper"] },
  { name: "Roberto Firmino", photo: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Roberto_Firmino_2018_%28cropped%29.jpg", club: "Al Ahli", country: "🇧🇷", hints: ["False nine", "No-look pass", "Premier League star", "Defensive forward", "Silky dribbler", "Iconic smile"] },
  { name: "Raheem Sterling", photo: "https://upload.wikimedia.org/wikipedia/commons/9/94/Raheem_Sterling_2018_%28cropped%29.jpg", club: "Arsenal", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Explosive winger", "Tap-in merchant", "Premier League icon", "Silky dribbler", "Dynamic attacker", "Elite movement"] },
  { name: "Marcus Rashford", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Marcus_Rashford_2018_%28cropped%29.jpg", club: "Manchester United", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Explosive winger", "Academy graduate", "Premier League star", "Knuckleball free-kick", "Hometown hero", "Dynamic forward"] },
  { name: "Bruno Fernandes", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Bernardo_Silva_2018_%28cropped%29.jpg", club: "Manchester United", country: "🇵🇹", hints: ["Midfield maestro", "Playmaker", "Penalty specialist", "Premier League star", "Elite vision", "Relentless workhorse"] },
  { name: "Federico Valverde", photo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Federico_Valverde_2022_%28cropped%29.jpg", club: "Real Madrid", country: "🇺🇾", hints: ["Box-to-box", "Relentless engine", "Long-range sniper", "La Liga star", "Champions League winner", "Utility player"] },
  { name: "Gavi", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Gavi_2022_%28cropped%29.jpg", club: "FC Barcelona", country: "🇪🇸", hints: ["Midfield dynamo", "Aggressive tackler", "Academy graduate", "Golden boy", "Relentless engine", "La Liga star"] },
  { name: "Jamal Musiala", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Luka_Modric_2018.jpg", club: "Bayern Munich", country: "🇩🇪", hints: ["Silky dribbler", "Attacking midfielder", "Bundesliga star", "Golden boy contender", "Dynamic attacker", "Elite vision"] },
  { name: "Florian Wirtz", photo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Rodri_2023.jpg", club: "Bayer Leverkusen", country: "🇩🇪", hints: ["Playmaker maestro", "Bundesliga star", "Elite vision", "Comeback kid", "Invincible season", "Attacking midfielder"] },
  { name: "Bernardo Silva", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Bernardo_Silva_2018_%28cropped%29.jpg", club: "Manchester City", country: "🇵🇹", hints: ["Midfield maestro", "Relentless workhorse", "Silky dribbler", "Premier League star", "Left-footed magic", "Treble winner"] },
  { name: "Trent Alexander-Arnold", photo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Trent_Alexander-Arnold_2018_%28cropped%29.jpg", club: "Liverpool", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Attacking fullback", "Elite playmaker", "Academy graduate", "Premier League star", "Pinged passes", "Corner taken quickly"] },
  { name: "Andrew Robertson", photo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Andrew_Robertson_2018_%28cropped%29.jpg", club: "Liverpool", country: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", hints: ["Relentless workhorse", "Attacking fullback", "Premier League star", "Aggressive presser", "Crossing specialist", "Captain"] },
  { name: "Achraf Hakimi", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Hakimi_2022_%28cropped%29.jpg", club: "PSG", country: "🇲🇦", hints: ["Attacking fullback", "Explosive pace", "Ligue 1 star", "Free-kick specialist", "Dynamic defender", "World Cup standout"] },
  { name: "Riyad Mahrez", photo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Riyad_Mahrez_2019_%28cropped%29.jpg", club: "Al Ahli", country: "🇩🇿", hints: ["Silky dribbler", "Left-footed magic", "Premier League icon", "First touch master", "African king", "Treble winner"] },
  { name: "Richarlison", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Richarlison_2022_%28cropped%29.jpg", club: "Tottenham Hotspur", country: "🇧🇷", hints: ["Target man", "Pigeon celebration", "Premier League star", "Acrobatic goals", "Relentless workhorse", "Dynamic forward"] },
  { name: "Cody Gakpo", photo: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Cody_Gakpo_2022_%28cropped%29.jpg", club: "Liverpool", country: "🇳🇱", hints: ["Versatile forward", "Premier League star", "Tall winger", "Clinical finisher", "Dynamic attacker", "Euro standout"] },
  { name: "Khvicha Kvaratskhelia", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Khvicha_Kvaratskhelia_2022_%28cropped%29.jpg", club: "Napoli", country: "🇬🇪", hints: ["Silky dribbler", "Serie A star", "Scudetto winner", "Dynamic winger", "Left-wing menace", "Elite flair"] },
  { name: "Lautaro Martinez", photo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Lautaro_Mart%C3%ADnez_2022_%28cropped%29.jpg", club: "Inter Milan", country: "🇦🇷", hints: ["Complete forward", "Serie A star", "World champion", "Scudetto winner", "El Toro", "Captain"] },
  { name: "Victor Osimhen", photo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Victor_Osimhen_2022_%28cropped%29.jpg", club: "Galatasaray", country: "🇳🇬", hints: ["Target man", "Explosive pace", "Serie A star", "Masked striker", "Scudetto winner", "Aerial threat"] },
  { name: "Romelu Lukaku", photo: "https://upload.wikimedia.org/wikipedia/commons/8/81/Virgil_van_Dijk_2018.jpg", club: "Napoli", country: "🇧🇪", hints: ["Target man", "Serie A star", "Premier League icon", "Record goalscorer", "Physical monster", "Journeyman striker"] },
  { name: "Ousmane Dembélé", photo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Ousmane_Demb%C3%A9l%C3%A9_2018_%28cropped%29.jpg", club: "PSG", country: "🇫🇷", hints: ["Two-footed attacker", "Explosive pace", "Silky dribbler", "Ligue 1 star", "La Liga winner", "World champion"] },
  { name: "Leroy Sané", photo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Leroy_San%C3%A9_2018_%28cropped%29.jpg", club: "Bayern Munich", country: "🇩🇪", hints: ["Explosive winger", "Left-footed magic", "Bundesliga star", "Premier League winner", "Silky dribbler", "Dynamic attacker"] },
  { name: "Serge Gnabry", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Serge_Gnabry_2018_%28cropped%29.jpg", club: "Bayern Munich", country: "🇩🇪", hints: ["Explosive winger", "Chef celebration", "Bundesliga star", "Champions League winner", "Clinical finisher", "Dynamic attacker"] },
  { name: "Diogo Jota", photo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Diogo_Jota_2021_%28cropped%29.jpg", club: "Liverpool", country: "🇵🇹", hints: ["Fox in the box", "Header specialist", "Premier League star", "Clinical finisher", "Gamer celebration", "Versatile forward"] },
  { name: "Darwin Núñez", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Darwin_N%C3%BA%C3%B1ez_2022_%28cropped%29.jpg", club: "Liverpool", country: "🇺🇾", hints: ["Agent of chaos", "Physical monster", "Explosive pace", "Premier League star", "Dynamic attacker", "Unpredictable striker"] },
  { name: "Alexia Putellas", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Alexia_Putellas_2022_%28cropped%29.jpg", club: "FC Barcelona Femení", country: "🇪🇸", hints: ["Midfield maestro", "Back-to-back Ballon d'Or", "Liga F legend", "World champion", "Elite playmaker", "Club captain"] },
  { name: "Sam Kerr", photo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Sam_Kerr_2023_%28cropped%29.jpg", club: "Chelsea Femenino", country: "🇦🇺", hints: ["Clinical finisher", "Backflip celebration", "WSL legend", "Elite striker", "Record goalscorer", "Dynamic attacker"] },
  { name: "Marco Reus", photo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Marco_Reus_2018_%28cropped%29.jpg", club: "LA Galaxy", country: "🇩🇪", hints: ["Club legend", "Attacking midfielder", "Bundesliga icon", "Injury comeback", "Elite playmaker", "Captain"] },
  { name: "Thomas Müller", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Thomas_M%C3%BCller_2018_%28cropped%29.jpg", club: "Bayern Munich", country: "🇩🇪", hints: ["Space investigator", "Bundesliga legend", "World champion", "Elite positioning", "Assist king", "Raumdeuter"] },
  { name: "Luis Suárez", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Luis_Su%C3%A1rez_2018_%28cropped%29.jpg", club: "Inter Miami", country: "🇺🇾", hints: ["Clinical finisher", "El Pistolero", "La Liga legend", "Premier League icon", "Treble winner", "Acrobatic goals"] },
  { name: "Paul Pogba", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Paul_Pogba_2018_%28cropped%29.jpg", club: "Juventus", country: "🇫🇷", hints: ["Midfield maestro", "Elite playmaker", "World champion", "Serie A legend", "Long-range sniper", "Flair player"] },
  { name: "N'Golo Kanté", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/N%27Golo_Kant%C3%A9_2018_%28cropped%29.jpg", club: "Al Ittihad", country: "🇫🇷", hints: ["Midfield destroyer", "Relentless engine", "World champion", "Premier League legend", "Humble star", "Defensive anchor"] },
  { name: "Idrissa Gueye", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Idrissa_Gueye_2019_%28cropped%29.jpg", club: "Everton", country: "🇸🇳", hints: ["Midfield destroyer", "Relentless tackler", "Premier League star", "Ligue 1 winner", "Defensive anchor", "Workhorse"] },
  { name: "Wojciech Szczęsny", photo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Wojciech_Szcz%C4%99sny_2018_%28cropped%29.jpg", club: "FC Barcelona", country: "🇵🇱", hints: ["Elite shot-stopper", "Serie A legend", "Premier League icon", "Penalty save specialist", "Commanding presence", "Safe hands"] },
  { name: "Jan Oblak", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Jan_Oblak_2019_%28cropped%29.jpg", club: "Atletico Madrid", country: "🇸🇮", hints: ["Elite shot-stopper", "La Liga star", "Wall", "Reflex saves", "Commanding presence", "Captain"] },
  { name: "Marc-André ter Stegen", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Marc-Andr%C3%A9_ter_Stegen_2018_%28cropped%29.jpg", club: "FC Barcelona", country: "🇩🇪", hints: ["Sweeper keeper", "La Liga star", "Elite distribution", "Reflex saves", "Treble winner", "Commanding presence"] },
  { name: "Nico Williams", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Nico_Williams_2024_%28cropped%29.jpg", club: "Athletic Club", country: "🇪🇸", hints: ["Explosive winger", "Euro winner", "La Liga star", "Dynamic attacker", "Brother duo", "Silky dribbler"] },

  // === RETIRED LEGENDS ===
  { name: "Sergio Ramos", photo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Sergio_Ramos_2018.jpg", club: "Retired", country: "🇪🇸", hints: ["Aggressive defender", "Late header", "Club captain", "La Liga legend", "World champion", "Panenka penalty"] },
  { name: "Zinedine Zidane", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_2019.jpg", club: "Retired", country: "🇫🇷", hints: ["Midfield maestro", "Silky dribbler", "Volley goal", "World champion", "Headbutt", "Serie A legend", "La Liga legend"] },
  { name: "Thierry Henry", photo: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Thierry_Henry_2019.jpg", club: "Retired", country: "🇫🇷", hints: ["Explosive pace", "Clinical finisher", "Premier League legend", "Invincible", "Left-wing cut-back", "Finesse shot"] },
  { name: "Ronaldo Nazário", photo: "https://upload.wikimedia.org/wikipedia/commons/8/80/Ronaldo_2002_%28cropped%29.jpg", club: "Retired", country: "🇧🇷", hints: ["Explosive pace", "El Fenómeno", "World champion", "Elite dribbler", "Knee injury comeback", "Complete striker"] },
  { name: "Rivaldo", photo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Rivaldo_%28cropped%29.jpg", club: "Retired", country: "🇧🇷", hints: ["Attacking midfielder", "Bicycle kick", "World champion", "La Liga legend", "Left-footed magic", "Elite playmaker"] },
  { name: "Roberto Carlos", photo: "https://upload.wikimedia.org/wikipedia/commons/6/60/Roberto_Carlos_%28cropped%29.jpg", club: "Retired", country: "🇧🇷", hints: ["Attacking fullback", "Power free-kick", "World champion", "La Liga legend", "Explosive pace", "Left-footed magic"] },
  { name: "Cafu", photo: "https://upload.wikimedia.org/wikipedia/commons/7/77/Cafu_2006_%28cropped%29.jpg", club: "Retired", country: "🇧🇷", hints: ["Attacking fullback", "Relentless engine", "World champion", "Serie A legend", "Overlapping runs", "Captain"] },
  { name: "Paolo Maldini", photo: "https://upload.wikimedia.org/wikipedia/commons/1/14/Andrea_Pirlo_2015.jpg", club: "Retired", country: "🇮🇹", hints: ["One-club man", "Elite defender", "Serie A legend", "Champions League king", "Commanding presence", "Left-back"] },
  { name: "Franz Beckenbauer", photo: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Franz_Beckenbauer_%28cropped%29.jpg", club: "Retired", country: "🇩🇪", hints: ["Sweeper", "Der Kaiser", "World champion", "Bundesliga legend", "Elite playmaker", "Leader"] },
  { name: "Johan Cruyff", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Johan_Cruyff_%28cropped%29.jpg", club: "Retired", country: "🇳🇱", hints: ["Total football", "Silky dribbler", "Turn trick", "La Liga legend", "Eredivisie legend", "Playmaker maestro"] },
  { name: "Diego Maradona", photo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Kevin_De_Bruyne_201807092.jpg", club: "Retired", country: "🇦🇷", hints: ["Midfield maestro", "Hand of God", "World champion", "Serie A legend", "Silky dribbler", "Left-footed magic"] },
  { name: "Pelé", photo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Pel%C3%A9_1970_%28cropped%29.jpg", club: "Retired", country: "🇧🇷", hints: ["Complete forward", "Three-time champion", "O Rei", "Record goalscorer", "Elite dribbler", "Global icon"] },
  { name: "David Beckham", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/David_Beckham_%28cropped%29.jpg", club: "Retired", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Crossing specialist", "Free-kick maestro", "Premier League legend", "La Liga star", "Global icon", "Right midfield"] },
  { name: "Wayne Rooney", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Wayne_Rooney_2017_%28cropped%29.jpg", club: "Retired", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Complete forward", "Bicycle kick", "Premier League legend", "Record goalscorer", "Aggressive attacker", "Teenage sensation"] },
  { name: "Frank Lampard", photo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Frank_Lampard_2014_%28cropped%29.jpg", club: "Retired", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Goalscoring midfielder", "Box-to-box", "Premier League legend", "Deflected shot", "Champions League winner", "Late runs"] },
  { name: "Steven Gerrard", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Steven_Gerrard_2015_%28cropped%29.jpg", club: "Retired", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Box-to-box", "Long-range sniper", "Premier League legend", "Club captain", "Champions League miracle", "One-club man"] },
  { name: "Rio Ferdinand", photo: "https://upload.wikimedia.org/wikipedia/commons/6/68/Rio_Ferdinand_2013_%28cropped%29.jpg", club: "Retired", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Ball-playing defender", "Premier League legend", "Champions League winner", "Rolls Royce defender", "Elite center-back", "Captain"] },
  { name: "Patrick Vieira", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Patrick_Vieira_%28cropped%29.jpg", club: "Retired", country: "🇫🇷", hints: ["Midfield enforcer", "Premier League legend", "Invincible captain", "Serie A winner", "Physical dominance", "Box-to-box"] },
  { name: "Didier Drogba", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Didier_Drogba_2012_%28cropped%29.jpg", club: "Retired", country: "🇨🇮", hints: ["Target man", "Big-game player", "Premier League legend", "Champions League winner", "Late header", "African king"] },
  { name: "Samuel Eto'o", photo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Samuel_Eto%27o_%28cropped%29.jpg", club: "Retired", country: "🇨🇲", hints: ["Clinical striker", "Back-to-back trebles", "La Liga legend", "African king", "Explosive pace", "Serie A star", "Big-game player"] },
  { name: "Kaká", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Kak%C3%A1_2013_%28cropped%29.jpg", club: "Retired", country: "🇧🇷", hints: ["Attacking midfielder", "Explosive pace", "Ballon d'Or winner", "Serie A legend", "World champion", "Champions League winner", "Playmaker maestro"] },
  { name: "Clarence Seedorf", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Clarence_Seedorf_%28cropped%29.jpg", club: "Retired", country: "🇳🇱", hints: ["Midfield maestro", "Champions League king", "Serie A legend", "Eredivisie icon", "Elite longevity", "Physical powerhouse"] },
  { name: "Gianluigi Buffon", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Gianluigi_Buffon_2018_%28cropped%29.jpg", club: "Retired", country: "🇮🇹", hints: ["Legendary goalkeeper", "Elite longevity", "World champion", "Serie A icon", "Elite shot-stopper", "Captain", "Commanding presence"] },
  { name: "Iker Casillas", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Antoine_Griezmann_2018.jpg", club: "Retired", country: "🇪🇸", hints: ["Legendary goalkeeper", "Saint nickname", "World champion", "Champions League king", "La Liga icon", "Reflex saves", "Club captain"] },
  { name: "David Villa", photo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/David_Villa_2018_%28cropped%29.jpg", club: "Retired", country: "🇪🇸", hints: ["Clinical finisher", "El Guaje", "World champion", "La Liga legend", "Two-footed attacker", "Elite movement"] },
  { name: "Fernando Torres", photo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Fernando_Torres_2018_%28cropped%29.jpg", club: "Retired", country: "🇪🇸", hints: ["Explosive pace", "El Niño", "World champion", "Premier League icon", "Champions League winner", "Clinical finisher"] },
  { name: "Toni Kroos", photo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Toni_Kroos_2022_%28cropped%29.jpg", club: "Retired", country: "🇩🇪", hints: ["Midfield maestro", "Sniper passing", "Elite longevity", "World champion", "Champions League king", "La Liga legend"] },
  { name: "Zlatan Ibrahimović", photo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Zlatan_Ibrahimovi%C4%87_2018.jpg", club: "Retired", country: "🇸🇪", hints: ["Target man", "Acrobatic goals", "Martial arts kicks", "Confident aura", "Serie A legend", "Ligue 1 icon", "Journeyman striker"] },
  { name: "Sergio Agüero", photo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Son_Heung-min_2022.jpg", club: "Retired", country: "🇦🇷", hints: ["Clinical finisher", "Late title winner", "Premier League legend", "Record goalscorer", "Near-post strike", "Low center of gravity"] },
  { name: "Andrés Iniesta", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Andr%C3%A9s_Iniesta_2018_%28cropped%29.jpg", club: "Retired", country: "🇪🇸", hints: ["Midfield maestro", "World Cup winner", "La Liga legend", "Silky dribbler", "Big-game player", "Illusionist"] },
  { name: "Xavi Hernández", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Xavi_Hern%C3%A1ndez_2018_%28cropped%29.jpg", club: "Retired", country: "🇪🇸", hints: ["Midfield maestro", "Tiki-taka king", "World champion", "La Liga legend", "Visionary passing", "Assist king"] },
  { name: "Ronaldinho", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Ronaldinho_2007.jpg", club: "Retired", country: "🇧🇷", hints: ["Flair player", "Iconic smile", "Elastico skill", "La Liga legend", "World champion", "Standing ovation", "Attacking midfielder"] },
  { name: "Gareth Bale", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Gareth_Bale_2018_%28cropped%29.jpg", club: "Retired", country: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", hints: ["Explosive winger", "Bicycle kick final", "Premier League icon", "La Liga legend", "Elite pace", "Left-footed magic"] },
  { name: "Gerard Piqué", photo: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Gerard_Piqu%C3%A9_2018_%28cropped%29.jpg", club: "Retired", country: "🇪🇸", hints: ["Ball-playing defender", "World champion", "La Liga legend", "Treble winner", "Club president vibes", "Aerial threat"] },
  { name: "Cesc Fàbregas", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Cesc_F%C3%A0bregas_2018_%28cropped%29.jpg", club: "Retired", country: "🇪🇸", hints: ["Elite playmaker", "Visionary passing", "Premier League icon", "World champion", "La Liga star", "Assist king"] },
  { name: "Eden Hazard", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Eden_Hazard_2018_%28cropped%29.jpg", club: "Retired", country: "🇧🇪", hints: ["Silky dribbler", "Elite winger", "Premier League legend", "La Liga winner", "Low center of gravity", "Dynamic attacker"] },
  { name: "Peter Schmeichel", photo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Peter_Schmeichel_%28cropped%29.jpg", club: "Retired", country: "🇩🇰", hints: ["Legendary goalkeeper", "Star jump save", "Premier League icon", "Treble winner", "Euro winner", "Commanding presence", "Giant presence"] },
  { name: "Ruud van Nistelrooy", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Ruud_van_Nistelrooy_%28cropped%29.jpg", club: "Retired", country: "🇳🇱", hints: ["Fox in the box", "Clinical finisher", "Premier League icon", "La Liga winner", "Elite positioning", "Penalty box king"] },
  { name: "Arjen Robben", photo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Arjen_Robben_2018_%28cropped%29.jpg", club: "Retired", country: "🇳🇱", hints: ["Inverted winger", "Cut inside left", "Bundesliga legend", "Champions League winner", "Explosive pace", "Silky dribbler"] },
  { name: "Wesley Sneijder", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Wesley_Sneijder_%28cropped%29.jpg", club: "Retired", country: "🇳🇱", hints: ["Attacking midfielder", "Treble winner", "Serie A legend", "Elite playmaker", "Long-range sniper", "Two-footed"] },
  { name: "Gennaro Gattuso", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Gennaro_Gattuso_%28cropped%29.jpg", club: "Retired", country: "🇮🇹", hints: ["Midfield destroyer", "Aggressive tackler", "Serie A legend", "World champion", "Fearless leader", "Defensive anchor", "Enforcer"] },
  { name: "Andrea Pirlo", photo: "https://upload.wikimedia.org/wikipedia/commons/1/14/Andrea_Pirlo_2015.jpg", club: "Retired", country: "🇮🇹", hints: ["Deep-lying playmaker", "Midfield maestro", "Free-kick specialist", "Serie A legend", "Panenka penalty", "World champion", "Calm presence"] },
  { name: "Raúl González", photo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Ra%C3%BAl_Gonz%C3%A1lez_%28cropped%29.jpg", club: "Retired", country: "🇪🇸", hints: ["Complete forward", "Ring kiss", "Champions League legend", "La Liga icon", "Club captain", "Clinical finisher", "Record goalscorer"] },
  { name: "Mesut Özil", photo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Mesut_%C3%96zil_2018.jpg", club: "Retired", country: "🇩🇪", hints: ["Elite playmaker", "Visionary passing", "Bounce pass", "Left-footed magic", "World champion", "Assist king", "La Liga star"] },
  { name: "Alexis Sánchez", photo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Alexis_S%C3%A1nchez_2018_%28cropped%29.jpg", club: "Retired", country: "🇨🇱", hints: ["Explosive winger", "Copa America winner", "Premier League icon", "Relentless workhorse", "Serie A star", "Dynamic attacker", "Flair player"] },
  { name: "Paul Scholes", photo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Paul_Scholes_%28cropped%29.jpg", club: "Retired", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Midfield maestro", "Long shots", "Premier League legend", "One-club man", "Visionary passing", "Pinged passes", "Treble winner"] },
  { name: "Roy Keane", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Roy_Keane_%28cropped%29.jpg", club: "Retired", country: "🇮🇪", hints: ["Midfield enforcer", "Club captain", "Aggressive tackler", "Premier League legend", "Elite mentality", "Fearless leader", "Treble winner"] },
  { name: "Park Ji-sung", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Park_Ji-sung_%28cropped%29.jpg", club: "Retired", country: "🇰🇷", hints: ["Three lungs", "Defensive winger", "Relentless workhorse", "Premier League legend", "Big-game player", "Cult hero", "Champions League winner"] },
  { name: "Pepe", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Pepe_2018_%28cropped%29.jpg", club: "Retired", country: "🇵🇹", hints: ["Aggressive defender", "Champions League king", "Fearless tackler", "La Liga legend", "Euro winner", "Dark arts", "Elite longevity"] },
  { name: "Xabi Alonso", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Xabi_Alonso_2018_%28cropped%29.jpg", club: "Retired", country: "🇪🇸", hints: ["Deep-lying playmaker", "Visionary passing", "Champions League winner", "World champion", "Long-range passing", "Midfield maestro", "Premier League icon"] },
  { name: "Bastian Schweinsteiger", photo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Bastian_Schweinsteiger_2018_%28cropped%29.jpg", club: "Retired", country: "🇩🇪", hints: ["Midfield general", "World champion", "Bundesliga legend", "Elite mentality", "Box-to-box", "Champions League winner", "Leader"] },
  { name: "Carlos Puyol", photo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Carles_Puyol_2011.jpg", club: "Retired", country: "🇪🇸", hints: ["Aggressive defender", "Club captain", "Shaggy hair", "La Liga legend", "World champion", "Elite leadership", "Fearless tackler"] },
  { name: "Ole Gunnar Solskjær", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Ole_Gunnar_Solskj%C3%A6r_%28cropped%29.jpg", club: "Retired", country: "🇳🇴", hints: ["Super sub", "Clinical finisher", "Late winner", "Premier League legend", "Treble winner", "Baby-faced", "Poacher"] },
  { name: "Javier Mascherano", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Javier_Mascherano_2018_%28cropped%29.jpg", club: "Retired", country: "🇦🇷", hints: ["Defensive anchor", "Relentless workhorse", "Fearless tackler", "La Liga legend", "Converted center-back", "Premier League star", "Elite mentality"] },
  { name: "Robin van Persie", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Robin_van_Persie_2018_%28cropped%29.jpg", club: "Retired", country: "🇳🇱", hints: ["Clinical finisher", "Flying Dutchman", "Premier League legend", "Left-footed volley", "Record goalscorer", "Elite technique"] },
  { name: "Ruud Gullit", photo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Ruud_Gullit_%28cropped%29.jpg", club: "Retired", country: "🇳🇱", hints: ["Complete footballer", "Serie A legend", "Euro winner", "Dreadlocks", "Ballon d'Or winner", "Elite playmaker"] },
  { name: "Vincent Kompany", photo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Vincent_Kompany_2019_%28cropped%29.jpg", club: "Retired", country: "🇧🇪", hints: ["Commanding center-back", "Club captain", "Premier League legend", "Thunderbastard goal", "Elite leader", "Defending rock"] },
  { name: "Yaya Touré", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Yaya_Tour%C3%A9_2019_%28cropped%29.jpg", club: "Retired", country: "🇨🇮", hints: ["Box-to-box", "Midfield powerhouse", "Premier League legend", "Unstoppable runs", "Elite penalty taker", "African king"] },
  { name: "Alphonso Davies", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Alphonso_Davies_2022_%28cropped%29.jpg", club: "Bayern Munich", country: "🇨🇦", hints: ["Attacking fullback", "Explosive pace", "Bundesliga star", "Roadrunner", "Champions League winner", "Dynamic defender"] },
  { name: "Alexander Isak", photo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Alexander_Isak_2022_%28cropped%29.jpg", club: "Newcastle United", country: "🇸🇪", hints: ["Complete forward", "Silky dribbler", "Premier League star", "Tall striker", "Clinical finisher", "Dynamic attacker"] },
  { name: "Dominik Szoboszlai", photo: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Dominik_Szoboszlai_2023_%28cropped%29.jpg", club: "Liverpool", country: "🇭🇺", hints: ["Box-to-box", "Long-range sniper", "Premier League star", "Elite ball-striker", "Relentless engine", "Midfield dynamo"] },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2', 'Player 3']);
  const [newPlayerName, setNewPlayerName] = useState<string>('');
  const [deck, setDeck] = useState<FootballPlayer[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [imposterIndex, setImposterIndex] = useState<number>(-1);
  const [targetFootballer, setTargetFootballer] = useState<FootballPlayer | null>(null);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [timerLeft, setTimerLeft] = useState<number>(300);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shuffleArray = (array: FootballPlayer[]): FootballPlayer[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const addPlayer = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newPlayerName.trim() && players.length < 15) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (indexToRemove: number): void => {
    setPlayers(players.filter((_, index) => index !== indexToRemove));
  };

  const startGame = (): void => {
    if (players.length < 3) {
      alert('You need at least 3 players to play!');
      return;
    }
    const randomImposter = Math.floor(Math.random() * players.length);
    setImposterIndex(randomImposter);

    let currentDeck = [...deck];
    if (currentDeck.length === 0) {
      currentDeck = shuffleArray(FOOTBALL_PLAYERS);
    }
    const selectedPlayer = currentDeck.pop()!;
    setDeck(currentDeck);
    setTargetFootballer(selectedPlayer);

    const randomHintIndex = Math.floor(Math.random() * selectedPlayer.hints.length);
    setCurrentHint(selectedPlayer.hints[randomHintIndex]);
    setCurrentPlayerIndex(0);
    setGameState('PASS');
  };

  const handleRevealStart = (): void => setIsRevealed(true);
  const handleRevealEnd = (): void => setIsRevealed(false);

  const nextTurn = (): void => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setGameState('PASS');
    } else {
      setGameState('DISCUSS');
      startTimer();
    }
  };

  const startTimer = (): void => {
    setTimerLeft(300);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endTimerAndVote = (): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('END');
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const fallbackSrc = (name: string): string =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=256`;

  const renderSetup = () => (
    <div className="flex flex-col h-full max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
          <Trophy size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Football <span className="text-emerald-400">Imposter</span></h1>
        <p className="text-emerald-100/70 mt-2">Find the imposter hiding in your dressing room.</p>
        {deck.length > 0 && (
          <p className="text-xs text-slate-500 mt-2">{deck.length} players remaining in deck</p>
        )}
      </div>
      <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50 shadow-xl backdrop-blur-sm flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users size={20} className="text-emerald-400" />
          Squad List ({players.length})
        </h2>
        <form onSubmit={addPlayer} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter player name..."
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            maxLength={15}
          />
          <button
            type="submit"
            disabled={!newPlayerName.trim() || players.length >= 15}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-xl px-4 py-3 font-semibold transition-all flex items-center justify-center"
          >
            <UserPlus size={20} />
          </button>
        </form>
        <ul className="space-y-2 mb-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {players.map((player, index) => (
            <li key={index} className="flex items-center justify-between bg-slate-900/30 border border-slate-800 rounded-xl px-4 py-3 animate-slide-in">
              <span className="text-white font-medium">{player}</span>
              <button onClick={() => removePlayer(index)} className="text-slate-400 hover:text-red-400 transition-colors p-1">
                <X size={18} />
              </button>
            </li>
          ))}
          {players.length === 0 && (
            <li className="text-center text-slate-500 py-4 italic">No players added yet.</li>
          )}
        </ul>
        <button
          onClick={startGame}
          disabled={players.length < 3}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:from-slate-700 disabled:to-slate-800 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
        >
          {players.length < 3 ? 'Need at least 3 players' : 'Kick Off'}
          <Play size={20} className={players.length >= 3 ? 'fill-current' : ''} />
        </button>
      </div>
    </div>
  );

  const renderPass = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-emerald-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        <Users size={40} className="text-emerald-400" />
      </div>
      <h2 className="text-2xl text-slate-300 mb-2">Pass the device to</h2>
      <h1 className="text-5xl font-black text-white mb-12 tracking-tight">{players[currentPlayerIndex]}</h1>
      <button
        onClick={() => setGameState('REVEAL')}
        className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl py-4 font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
      >
        <Check size={24} /> I am {players[currentPlayerIndex]}
      </button>
    </div>
  );

  const renderReveal = () => {
    const isImposter = currentPlayerIndex === imposterIndex;
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center w-full animate-fade-in">
        <h2 className="text-xl font-semibold text-slate-300 mb-8">
          Player {currentPlayerIndex + 1} of {players.length}
        </h2>
        <div
          className="w-full aspect-[3/4] max-w-sm relative rounded-3xl cursor-pointer select-none touch-none"
          onMouseDown={handleRevealStart}
          onMouseUp={handleRevealEnd}
          onMouseLeave={handleRevealEnd}
          onTouchStart={handleRevealStart}
          onTouchEnd={handleRevealEnd}
        >
          <div className={`absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 rounded-3xl flex flex-col items-center justify-center shadow-2xl transition-opacity duration-300 ${isRevealed ? 'opacity-0 z-0' : 'opacity-100 z-10'}`}>
            <Eye className="text-emerald-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-white mb-2">Secret Role</h3>
            <p className="text-slate-400 text-sm max-w-[200px]">Press and hold anywhere on this card to reveal</p>
          </div>
          <div className={`absolute inset-0 rounded-3xl flex flex-col items-center justify-center shadow-2xl transition-opacity duration-300 p-6 overflow-hidden ${isRevealed ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${isImposter ? 'bg-gradient-to-br from-red-900 to-red-950 border-2 border-red-500/50' : 'bg-gradient-to-br from-emerald-900 to-emerald-950 border-2 border-emerald-500/50'}`}>
            {isImposter ? (
              <div className="flex flex-col items-center justify-center text-center h-full animate-scale-in w-full">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                  <ShieldAlert size={48} className="text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wider">You are the Imposter!</h2>
                <p className="text-red-200/80 mb-8">Try to blend in. Do not get caught.</p>
                <div className="bg-red-950/80 border border-red-800 rounded-2xl p-6 w-full">
                  <span className="text-red-400 text-xs font-bold uppercase tracking-widest block mb-2">Your Secret Hint</span>
                  <p className="text-white font-black text-3xl uppercase tracking-tight">"{currentHint}"</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center w-full h-full animate-scale-in">
                <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest block mb-4">Target Player</span>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500 mb-4 shadow-xl bg-slate-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <Users className="text-slate-600" size={40} />
                  </div>
                  {targetFootballer && (
                    <img
                      src={targetFootballer.photo || fallbackSrc(targetFootballer.name)}
                      alt={targetFootballer.name}
                      className="w-full h-full object-cover relative z-10"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackSrc(targetFootballer.name);
                      }}
                    />
                  )}
                </div>
                {targetFootballer && (
                  <>
                    <h2 className="text-3xl font-black text-white mb-1">{targetFootballer.name}</h2>
                    <div className="flex items-center justify-center gap-2 text-emerald-100/70 text-lg mb-6 w-full">
                      <span>{targetFootballer.country}</span>
                      <span>•</span>
                      <span className="truncate max-w-[200px]">{targetFootballer.club}</span>
                    </div>
                  </>
                )}
                <div className="bg-emerald-950/80 border border-emerald-800 rounded-xl p-4 w-full mt-auto">
                  <p className="text-emerald-200 text-sm">Describe this player to others, but don't be too obvious! The imposter is listening.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={nextTurn}
          className="mt-10 w-full max-w-xs bg-slate-700 hover:bg-slate-600 text-white rounded-2xl py-4 font-bold text-lg transition-all transform active:scale-95"
        >
          {currentPlayerIndex < players.length - 1 ? 'Pass to Next Player' : 'Start Discussion'}
        </button>
      </div>
    );
  };

  const renderDiscuss = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center animate-fade-in w-full">
      <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 w-full backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Discussion Phase</h2>
        <p className="text-slate-400 mb-8">Ask one question each. Find out who doesn't know the footballer!</p>
        <div className={`text-7xl font-black tabular-nums tracking-tight mb-8 ${timerLeft < 60 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
          {formatTime(timerLeft)}
        </div>
        <div className="flex justify-center mb-8">
          <Clock size={32} className={timerLeft < 60 ? 'text-red-500' : 'text-emerald-400'} />
        </div>
        <button
          onClick={endTimerAndVote}
          className="w-full bg-red-600 hover:bg-red-500 text-white rounded-2xl py-4 font-bold text-lg transition-all transform active:scale-95 shadow-lg shadow-red-600/20"
        >
          End Time & Vote
        </button>
      </div>
    </div>
  );

  const renderEnd = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center animate-fade-in w-full">
      <h1 className="text-4xl font-black text-white mb-2">Game Over!</h1>
      <p className="text-slate-300 mb-8">Who did you vote for?</p>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 w-full shadow-2xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-red-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <span className="text-slate-400 text-sm font-bold uppercase tracking-widest block mb-2">The Imposter Was</span>
          <h2 className="text-4xl font-black text-red-500 mb-8">{players[imposterIndex]}</h2>
          <div className="h-px w-full bg-slate-700 mb-8"></div>
          <span className="text-slate-400 text-sm font-bold uppercase tracking-widest block mb-4">The Footballer Was</span>
          {targetFootballer && (
            <div className="flex items-center gap-4 bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
              <img
                src={targetFootballer.photo || fallbackSrc(targetFootballer.name)}
                alt={targetFootballer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackSrc(targetFootballer.name);
                }}
              />
              <div className="text-left overflow-hidden">
                <h3 className="text-xl font-bold text-white truncate">{targetFootballer.name}</h3>
                <p className="text-emerald-400 text-sm truncate">{targetFootballer.club} • {targetFootballer.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => setGameState('SETUP')}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl py-4 font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg"
      >
        <RotateCcw size={20} /> Next Round
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-emerald-500/30">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900 via-slate-950 to-slate-950"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10 h-[100dvh] flex flex-col">
        {gameState === 'SETUP' && renderSetup()}
        {gameState === 'PASS' && renderPass()}
        {gameState === 'REVEAL' && renderReveal()}
        {gameState === 'DISCUSS' && renderDiscuss()}
        {gameState === 'END' && renderEnd()}
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(52, 211, 153, 0.3); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(52, 211, 153, 0.6); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}
