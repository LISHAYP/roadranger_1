import { Dimensions, StyleSheet, Text, View, Image } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'
import GradientBackground from '../Components/GradientBackground';
import Icon from "react-native-vector-icons/Ionicons";
import Geocoder from 'react-native-geocoding';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function EventDetails(props) {
  const event = props.route.params.event;
  console.log(event)
  const [traveler, setTraveler] = useState('');
  const [addressComponents, setAddressComponents] = useState('')
  const [comments, setComments] = useState('')

  const fetchTravelerDetails = async () => {
    const travelerobj = {
      traveler_Id: event.TravelerId
    };

    try {
      const response = await fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/traveler/details', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(travelerobj),
      });

      const data = await response.json();
      setTraveler(data);
      console.log(data);
      fetchNumberEvent();
    } catch (error) {
      console.error(error);
      console.log('Error');
    }
  };
  const fetchNumberEvent  = async () => {
    console.log("in fetchNumberEvent")
    const eventNumberObj = {
      eventNumber: event.eventNumber
    };

    try {
      console.log("in try fretchfetchNumberEvent",{eventNumberObj})
      const response = await fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/events/comments', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventNumberObj),
      });

      const data = await response.json();
      setComments(data);
      console.log(comments);
    } catch (error) {
      console.error(error);
      console.log('Error');
    }
  

  };

  useEffect(() => {
    fetchTravelerDetails();
    Geocoder.init('AIzaSyDN2je5f_VeKV-DCzkaYBg1nRs_N6zn5so');
    Geocoder.from(`${event.Latitude},${event.Longitude}`)
      .then((json) => {
        const location = json.results[0].address_components;
        console.log(location)
        const number = json.results[0].address_components[0].long_name;
        const street = json.results[0].address_components[1].long_name;
        const city = json.results[0].address_components[2].long_name;
        setAddressComponents(`${street} ${number}, ${city}`);
      }
      )
      .catch(error => {
        console.error(error);
        console.warn('Geocoder.from failed');
      });
  }, []);


  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.eventContainer}>
          <View >
            <View style={styles.event}>
              <View style={styles.row}>
                <Image style={styles.img} source={{ uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIVEhgSFBIZGRIZHBwaGRwZHBoaGR0aHBkZGRgYGhogIC4lHB4rHxocJjonOC8xNjY1GiQ7QDszPy40NTEBDAwMEA8QHhISHzQoJCs0NDQ0NDY0NDQ0NjQ0NDQ0NDY0NDY0NDQ0NDQ0NDQ0MTQ0NDY0NDQ0NDQ0NDQ0NDQ0NP/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAAAQUDBAYCBwj/xAA+EAACAgEDAQUGBAMFCAMAAAABAgARAxIhMQQFIkFRYQYTMnGBoUKRscEjYtEUM1KC8AcVcnOSorLhJDTS/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAECAwQF/8QAJREBAQACAgEDBQADAAAAAAAAAAECEQMhMQQyQRIiUWFxE0KB/9oADAMBAAIRAxEAPwD6FERIeiSJMQIiIgIiIERJkQEiUHb3tRi6Y6B38nkOB8zOTye3XUFjSqo/SFMuTHF9LifKX9rOsDhmy0v8oBBHqDxLns//AGjYy2jLiIqu+pBBHnUIx5ca72Jg6LrMebGMmNw6Hgj9D5H0meGhIkxCyIiICIiAiIgIiIHmJ6nmAiIgZoiIUIiISSJMQIiIgJV+0XaHuOmfIDT1pT/iO1/Tc/SWk4H/AGidaTkTAOFXUfm/dH2/WFc7rG1wXaHUMTzuf3Jmtjdqs8czz1z9+v5v0r95n6ZNbqv4bF+u+8m3Uccm66jsTsvXiDMB3t99/lNb2j9m9Ka8Y33sATqOgICADibT9TjVScjhVHiZyzO/Vt1XDH6dVxX+zztp+n6j3Lm0ybab4YcHf0ufYQZ8V9tulVMidThsKxomipDcg+HO/wCU+jexvbSdRhUK5LBRYY2ynxF/iHiD5fKby77Rx3V+mukiIlm5IkxAiIiAiIgIiICIiAiIgZIkyIUIiICIiEkiTECJ8w9tz/8AOe+AiH8l2+8+nz5J7b5r63qBfARR/wBA/e5FZ8vtcVna3Hn/APo/0m92dmHvL/CKEr8xp78r+woTP2cjaSFNOfhPl6ycvDlx8u16ftZgdPuyq+bEaj66fASx67pXy4Rkx0cg41bgHzqUvY/ZZVLayxNlmNtfkPIS87L6xUYhj3D+s5MtS9O3GWztq/7l99gdHZi7IBZ2UMu4ZU8N5zfst1GTpuqvgIyhxf4S2htvEA/tO26rtLQwNfw24aq+hnI5Vxv2g+NjQyMgJ/lf3ZP3BP5TTDK3cZ8mMx1Y+zxNXsxy2FCT3tIB+Y2P3E2pu1IiIWJEmIEREQEREBERAREQMsREKIiTIgIiICIiEtLtftBenwvmbcKNh5ngD858V6/qHfK7ubyMQzf8Rtq9OZ9V9uQ39jbSLIZD9AwJnyDFk1ZGJPmfryJW+WHLe1T2gaYL6b/6+ky9D1FZL8KAH2mr1mTUxPrtNvAynGBXfUg38x/r8pNm4wwusnc9D1t49jMJdGbSi68g5AIAHqzHYfrKnsrqgOZbf2fFkNsq6h48H8xObUl7d2OUvlZpresbZFICsSibqpBAUFzux5vw4nAdqdcR1rZFOysF/wCkBf1Bndt1ODpsTvqGrSQN+TXdHmTc+aYMZOQWdydz6nkzXj1bay9RlNyR9/8AZjr8ebAroeQCR5NVMP3+suZ8X9jO2m6fIN/4ZIDD0PwsP0+k+zY3DKGHBFiaRbjy3ExESWpERASJMQIiIgIiICIiBliIhQiIgREmRAREQOZ9vuq0dGx8zp+hB/pPjvS/Czen5kj9AK/OfT/9rAP9jUi6Dj7iv6z5arUhAO2wB89W5b8qlflz8t7U53Mtul6ShZPNbev+jNLpkWyx4BmZeoJa78bl2M/K66HGD3fEAflLPGhErez8td6jYFEeNXufpz9JfJhQgfxDrZLCaKYEixuWogb38vCZ3iyt3Gs5cZO3K9tBnYEWSt7em1mvnX5zT6ataluCRdeVDedb2d0yrkVDTZCWPepSQpUi9zY3FfI/X1k9n2fIrKUTGqsCe7duDZNbEatgR9qmv+OyaY3klu1N2JgDo5ba2Rdv8xP3In2f2fcnpsYY98ILHjOK6Ts/DhRtCIzhlbxJAUAGtyLsHaWnYnXEuA+TdCdIZSoAttShgabfxPpvE4rLbavhzyXw7ORIxuGUMpsEWJ6lXbKiJMiFiIiAkSYgRERAREQMsREMyIiEkRECIkyIFR7Udl/2npXxAW1WvzHE+D5sb47VgQQaFit5+iOq6pMal3PdHP7D5z557QMnUnU6Iq02kGgwN6QWvxsj9r5k44XLuObmyxn9fLAaFGZujVWIUghr+If0Mueo9n3uxQQ0QDeo7A0oF787ek3Ow+ztORLVtIpyKstupUbXtuTW/HAlphdue5RHZ3Z7pQdTqItCa1KLod3lbJ3NfQ7zoujx4/eoRrJo6lJ0uoAaxqIs7/zCgx+U99f0p0gjIpyJ32QbMFUrSXV82eOX9ZsZAQXKKWyFwCyjUQrmmULW27oPrNsZ1plle9qbouhVnfVsxNt/iFgrZAJoktVb/huhL7pMeqlKlSFW6BQE0TZ4KkbUfUTX6jEiZAjYAGcWtLuCymiBewPiebB86louLK+MqyAZMSlcgWgMgTZNQ8AyixR28aIEm/tEaCINRxjGh1MwbuoKUHemA+HZtvXea3VnG7KEZ+5q2XhWFEV/LQ8fUSzwYyveBLIVrTypBUnQSPECh573NHqOkTGr5sb6wrIW1DgEb3XI53vzlrJVd2Lr2f7YIYY8nwNQUk8NVeVaWqx851k+dJnGksE/h0aOmjWk/hJB58a4InY9hdcHxqN7CitXJFDn1nPyY/Lu9Pyf63/i0iImbsREmRCxERASJMQIiIgZ55nqIZvMREBERCSRJnnI1KT6GBzPavVYncY3BZXNbE/EnfFV9AfXbwlaHwuyJqrIEBJVSBYZO6GIo8AXfA847VdFZQG05XBZRuaLnvOp/wAwNk+Ew69GTvKSqIdBPdYkZKsmrYCjwPH8+mY71I8rLLzawdf0WJ8tnMArA6aIK/hagPDctxXJ8ph7P6HGgdzlCuusYSShrSShLbW27Morz8Nply9OuTIuRlBQBzpUV8GrQgJNtsjG9uKm50Qxq5QsWyF2SrOhDbEIN7FIAL9fMb311/FN9sfaSamOTf3YxgISUGoWrBid7LaefQCt5nz9Sf7SgIX3bhNLd0CtNEXwQWXjkC/pi7Q6TKbf3ilFRioGpapXAVRvzbDeqr13sc/TY8je8LJqAOMaj+KlYkWABR8fnUjU0b7R2pjxrjRnGvTqDMtWha7cqg2bUSvHj4G5oY8qqUysDqxinBFrkQaAx0tuKZlIHz8jNjpelLHI2lBjp9damBrVZUA1puyRdjcUdph6hFTIGfEGxtYxjWLOrlb82tiOTtz4yLJNdpltbeXMHRWxY9WJiAarWmRRvSk7NdC9784x5AqbgkbK4YCwCSAxNC1skiqOxHga94OnXTqw/wB27bprI0PRIBNkA1XF1Q388ufo1bG65czHQGVaUBiLu2BvVQF7eZPjL9a0rfO1DlwM2T3i5G7obGQO9q3XcLdXsNvnM/QdRkGbUuRTobvgcbiinqQTU1uq6F8bHXrSm2a7JUKpVx5nu7jzMw4+oBZAq0rOX45BbY3dH1HNylk8L45XqvpGHIHUMOCLnucl2L1xxNRNYmbSQT8J4VgSeDtc62c2WOq9Li5Jnjv5IiJDVESZELEREBERAzREQzJ5nqIHmIiAmt2iT7p650mbM1+0K9218ePyuTPKM/bXENiXIwfGyjRoQKVULenUytS8+IPF351NlcDZQyBj71VAJI02xpSmoUC3y8qqjU1n6bHlxuiKRWQNue+9bUN/OwPKj6zPgzv7x10lceTu0FVqfTpY1ZNAh/AX8+ej5/jzPhoZ8+N+rx6M7EAsqjfc2wIvgGr222BmfoumVcfvF13rslmLWuolzfxUFrvbA2KJsiVXX9DpARwhtjpIPdrQ2n12agPHn62fZnVFOlC2WDB1YDu0WvQoIBPdorXgBq4Fm27vqq2flbY8GNO6p/tHvH+AmlXklyKIoAg2dhqvym3h6HCmnK1nGVASwtE6XdgwHdZdNmz4mrNCYMvV4nwI+bSFCAmqZipCaXUGyFANWa53HhNLERlH8LK+hWvQ7UoAtA12dtV90nivOxMtt7RZpYnJjAZmxupQaGDLV+8YkkKpPdGxq+L+tdoyrj93pOpTaWDuq96q+IggMPDfbe5lz4i38JXCY0oOrtbIxJOpSzbpTCrO1AcgAZUKPitrV8Y0tTEsFXuv4k3vfl8Oxrdua7R3L01uh6oYMbl0/hO4BJUjyoiwKAr6bm5ZYzkTMgXIDjbj3m50hbOvfvG2AHp47zVyIuNWZrdWB1BympiL01xuOb8r32lZ1HVI2RMiYyuNkXWgJ3Y6wF5NrsDXBAXcRtOttb2me8j41cgaR3TQOpq7pJ2q6+djwmt1BJoIDppWoCqNqpG1aaNn6G5sdp4i+T3yKDjR9JB3oCgBd/6oTA/Su7ApkGwokcVqskmjXhfrKS9ps1GBuuIJZyCNiFF7Izbgnz8D/wAQncezvWsyFGNhTSt4kfh+lbXOU6PsvC6qotiy/hAJWgAdhvR/LYyxTKmtBiLrlVVBHA0Kd72qyKHrctljLNVbDkuOUsdtEmROR6xERAiIiFiIiBmiIhmREQE8z1EDzMHWmsbVzW3z8Jnmp2o5GM1WokAXxZ2F14WRJnlXP23+ORHVYS2ou10FCA98BTq1rWy0CbHHAmTs/rUUgrkHu274JVVJZ9QOutwbJHAvzvaee08gxOrqgZQoUruLOlSu/nSkVXjzMiYlzYsiqjpTE33d9Onui6ZgLs8bE+PHTJPl5ltct7QOrnGyEnTZ1A22sOCVquBfHhtzzN7s1m927IC+J0FXp1KQK10aBoEMKE1+qTGcuPCpsqzuxO2ohQNNfOvqTU3syEaG0tYD0BfiD/eKPwgGuD47CP1EfurvF1AfC7uw0GgiUAaNqASNrNHYjbbxqaHZmNVLONRyFDooKwUUHRlVgdqq+D3eBNoYTpRQll00nUbHiWYhjuNY+feJ5FHXKaMj50YMKU6VI1KrUQdI5FE7WPh8Ix1qwrEnVY3XU6qrg26gLpbWQGBO5N7Xy2w3G8ydmaQTjUAZmBW7pK5PdBu9NG/P1sTUdMajWi6u8xAQkhVUVoDbAtTKCTvsCLqa/Uda+NUbFjOpySx0FiAa5tee9ZBr9za6l6RJbFj2rmRQuNQA67ngupYg0Dub1HnyY0NpX9OS7dxmCBdTNYZtVJQ43ICmz/MJ4/3m+gK+INlo610gFjZFhbtq58qocixGAA9TrcOjkK3GkMHFjV490KR+fMrlftTjLa6nsjotWHI7XoZSBZv4QO9z5i/rOczdUMIDkk0PAndS3wPWwFnfbf6Toe2+2sOLpdABUEaQEA2AF15Cxt9ZyPQ9QGIT3bIDRL5aKqgAsKld41zK8fe8vy15tTWM+GbpXyucmgnHifYBDQ2Fa2ahZ8aBqb2DpKyDHga30qA7HkCqAvjeifUSwPTVS/iRL7p7j7nfunxC/eeOz0KhXcFz7xaK8KAxpQvluRc0+m+WMs6db0ON1xgO2p/E+vpNiInHbu7exJqaREmRCSIiBESYgZYiTCqJMiICIiAmp17AKti+8NvPY0JtzS7RbZRtuSBfnVAfepM8qct1jXIZMLv1WgYnAGmjq0hg2xUkWAQoI49Ad5uuoKugUouMPkUhgGOzYwKo7GyLu/L01un6nL7xveMt600BtwWCjVvfmSdqvaZ8HVZDhcNjBJLK+mhyTTc0d9K1Y5P16Lt5vTkOv6ke9wZlBQIzl071groDJf4rIIoeIEvE6XKUbMciAhnJonegpUeopm32oNdETWzYPfL7v4AWaid3KlyQhJqiCx9OZadm9AiEqwyHIqXoDLpZFoA0xGrYCx/OflLzStrzg6nIcZyJh1jEhRRYJrWStKd70jcVwbuuMfX4w+RTo0+8Q6giGi7sGQu29VY35BBNVscr9Z1CNob4hqYufdqlawa4O2gLfBPpMHTZ8ZXIOnUvqoAtZXUL75at23o1/hHFSmU0nGtjoUyAaE+MMpClSFYWzHcjurewINA/lPJ7PLuHV6C69eOizoxQLTEWCQbogcGtqInrpuyeoch2YB71WVD73tu3h6VRO8u+m7Eyhjk98QWFHaxXlV7jih4UIyyx0mY5bcn1/SY1AKDXoVlYps6fhBC2o87ry5reawwZMiKuiiVCu5JvYhr52F2KvkeRnc5eww+QM3UOPGkRUPIAtg1kb1XkTxK32i7CZCmZGdxel1Zh3RVal0rfAI39JlnlJj9rbgx3nrK6ir6npenXHpdtTqAFI0kgt3QQpPeO9D5yen7OxnC4fW4Y6QHWtAO1qpsgizZv6TF1LH3ZVcSjHVk7Hk6e943zMXTPkcrhxs7lQQGPeVRQNG/EED9Jbhytw0jnw1nufKqcZOnAZcgOihVBhX+FfHm9/lLzsbtHJ1BRdKG28Adu9qJNHkEnn0njpPZvqSaK0nBLbE2N/E3uT4Cdj2V2PjwL3VGs8tVfkPASbyanVThwZW9zpYARETB6BERCURJkQEREDNIkxCiIiISREQEp+3+o0BTo1+BHkrEBiPWuPlLiUXbmXIuVFQWGB1KKsiwOSNtjzxL4TeUY811hVF0rh8zqxQUNC738XdAayL5Ow4qvCeHS3XG7AohJIeyDZcg6a0m2IPOx+glhkzBWCnF/ECu60e73XBbV6EaTXn5czW7Y6zQVC48ZZ9BY2KIQGqu+8STtR2ANmqnRL8R59il6nqcgyJ7lFKMpq7BBVvTgWT/1Dym9h6Dq8nea058Q3xEki+62n0v9BLTsrpCch113QFFChQs/vOmx9NSipnllZbpeYzTnOl9my4K58gdSeLbgm9O7Hb0nQ9P2VjQAKtAbCgKAHhtN3Gp1Di/l/wC55ZB/hU/IkGZXdXFxqOR9jU9DEvINH7GeWeuCR6ao97fn9v6RoeEUjKSP8HgPENzXhzHaeHI+NlRwHrulvhFec9qdwSfD0855zZdxtvXgL+/hERvVlcsnYTZNWPLktSp1BbG52Jv7ze9n+wh0yka9bHxqqFAVLUklwTW6txv4rVnxmSVn27kdvHrKTK+SIiGxIkxAiIiAiIgREmIGWIiFCRJiAkREJJUdqu3vFUGrG5onanuq4O1/SW8qe0HVco1eI7tXyoawfMEN9pfD3MOf2KbEA+MqS1o7Y9fw3qZQ4bY6RTEgHmvCeeu6PFSJkcHQpcOLFY1cXuKDLQ5FHmuRXvo06l8aqXUoO448wyD4jZtgWHhNPH2g2bMF0KcbL3zbAUgB3vbyPmAw9Z0autxwbm3Qdki1Y1vqI5258D+UuQ5GxAK+G/2uVfY/wWviWYfLUSPtUuAqstm6PNefy85hl5azwnG6+ZBHg3H1Ml0f/AG+oP5eM8pR7updXAvY/kRIVGB0kUf+0/0PykJY8j0d9Sj5WPtMLAHcEbev7GZ83vV3qx+c1m6jIT8A+o8IGxjvxrjy+fkZ5ONi2w8PkPrtcY38aoUNh+YH3EzAsTV7VvIxRWLIpGmyLvhRsNj/AEiZcqqMdjzsetG2I+kxSMvLq9Pft0RESHQREQkkSYgRERAREQMsREKEREBIkxASn7SF5VIPfVHYAj8IVdW/qaEt5WdaiF3Zj8CEEVsQ1VfnRHHrNOP3MfUexUdm42Q++fUqoFDUBR4QfCDYAbgcaSPGVzNlbMq1pVrcAqut9ChiLvvfECRtwfEidF2gMaYmXFWo+PPeckX86Nbec5bsXpch/iLkDMofSHCe8Chl7yswYG6F2NtXrN7XBJ06/spwUsCiDvZF3dneWKOUJ08HkX+0ruyCrYw6WA1MLGkm1FtXkRuPPaWt7cAj1/rOfLzWuPh7zuWXUuNWHndEH1mm3WH4XTYHY3+82MeQKbQH1FivvGXqsLDvow89tvsZCXhOrUeqmvP7x1PTBhqTceXp6zWfpcb74nBP+G9556fI6Ej/ALSN42jTYVQOPA/fgfpPTvo2q2O9cfn5T1sgJBLP4BRQF+Zmg7shs0GP+ZvooiFb+LW5IJBNUT4C9gBIAPB2I2PzHM1emTI3LFVHr3ifTwWbTY9Jr5Hm624vxituDLWViIkyJV2EREBERCSRJiBEREDLERJUIiJAREQEp+0utVELbElwouvAb7nyq/KwJbmcb2q7rqJt8Ys6QG1igPg8DRBNCj41zNOPrLbm9Tb9MjQydQMis+IVpBUEOVcmy4VdOw9Rf4h85g/suPCqAsG6ggZQo7oKhQNOw72qiaN34GyBNZuoTNpxIznGEDXrAZyBblVPO229Hf0ubXXdfkOXHgVAFGwbZ2AIIALEdxyFYg+XFTW3V25dbmnXdg5i2MnSVGpgBsNgdthsdv0+ktwa8x48/wBZqdJh0Y1BO45PrQNzYDeRI9PWc+V3dtZNRlBPrfmCP2G82Az+NTVU+dX8iPzmZD5UPrcRFYeq7P1jWhrIOGHHyIHImj77Vs6lcqff+oPnLhnNfFv6D/3K7tXESiupJbVpIO+xBP57cSMvHRGfHiDqCchA8QDv8vlMvT9FjXcD5k/1PMoUzZUNhT9jNhO1GvvqzD5EftGOX5LivC6iwtfM1MWXGKFb1yfP19Zr9P1/Ssd+6fWWZCMndOoem5l7dpx+3KVXRESj0ERJkQEREBERCSIiBkiIkqEREBERICcj2z/fH/P+gkxL4eXP6jxFD7I/32T/AJa/o0sO2f8A7af5P/FoibXxXJ8x3nZ3wN9P/ETXx8j5iInM2bOHhvpIHI/14xEmIrJiml2l/cp/zf2aIi+ERgzfvMD/ABD/AF4REhZ5fxm/2H8ZkxE8jPk+I/OeYiHdj4hERCUREQEREJIiIH//2Q==' }} resizeMode="contain" />
                <Text style={styles.text}>{traveler.first_name} {traveler.last_name}</Text>
              </View>
              <View>
                <Text style={styles.textdateTime}>{event.EventTime} {new Date(event.EventDate).toLocaleDateString('en-US')}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.detailsText}>{event.Details}</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={30} color={'black'} style={styles.locationIcon} />
            <Text style={styles.locationText}>{addressComponents}</Text>
          </View>

          <View style={styles.pictureContainer}>
            <Image source={{ uri: 'https://img.mako.co.il/2021/10/07/photo5978846621133289432_autoOrient_i.jpg' }} style={styles.picture} resizeMode="contain" />
          </View>

          <View>
            {comments.map((comment, index) => (
              <View key={index} style={styles.commentContainer}>
                <View style={styles.event}>
                  <View style={styles.row}>
                    <Image style={styles.img} source={{ uri: 'data:image/jpeg;base64,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' }} resizeMode="contain" />
                    <Text style={styles.text}>{comment.TravelerName} </Text>
                  </View>
                  <View>
                    <Text style={styles.textdateTime}>{comment.CommentTime} {new Date(comment.CommentDate).toLocaleDateString('en-US')}</Text>
                  </View>

                </View>
                <View>
                  <Text style={styles.detailsTextComment}>{comment.Details}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </GradientBackground >
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 5,


  },
  pictureContainer: {

    height: height * 0.2, // adjust this value as needed
    width: width + 30,
    bottom: 10
  },
  picture: {
    flex: 1,
    width: width,
    height: height,
    padding: 5,
    borderRadius: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  locationIcon: {
    marginRight: 10,

  },
  event: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  eventContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    // borderColor: '#144800',
    // borderWidth: 1,
    borderRadius: 15,
    // backgroundColor: '#F5F5F5',
    padding: 10,
  },
  commentContainer: {
    borderColor: '#DCDCDC',
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    margin: 5,
    padding: 10,
  },

  locationText: {
    fontSize: 15,
    fontWeight: 'bold',
    top: 5
  },
  detailsText: {
    alignItems: 'center',
    fontSize: 20,
    left: 10,
    // textAlign: 'center',
    marginTop: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',


  },

  img: {

    height: 40,
    width: 40,
    borderRadius: 20,
    // backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
    marginLeft: 'auto',

  },
  textdateTime: {
    fontSize: 16,
    marginVertical: 5,
    fontSize: 10,
    right: 10,
    textAlign: 'right'
  },
  detailsTextComment: {
    fontSize: 15,
    paddingTop: 5
  }

});
