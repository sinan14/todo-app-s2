import { BounceLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div className='absolute top-[50vh] left-[50vw]' style={{zIndex:99999999999}}>
      <BounceLoader color='#24b585' />
    </div>
  );
}
