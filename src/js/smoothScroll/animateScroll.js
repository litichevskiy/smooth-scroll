export default ({ steps, animationName, easing }) => {

  const getNextStep = ({ i, animationName, height, isIncrease, start }) => {
    const point = easing[animationName]( i ) * height;
    return ( isIncrease ) ? start + point : start - point;
  };

  return ( height, start, isIncrease ) => {

    const quantitySteps = 1 / steps;
    const points = [];
    let i = 0;

    while( true ) {

      if( i > 1 ) {
        points.push(
          getNextStep({ i: 1, animationName, height, isIncrease, start })
        );
        break;

      } else {
        points.push(
          getNextStep({ i, animationName, height, isIncrease, start })
        );
      }

      i += quantitySteps;
    }

    return points;
  };
};