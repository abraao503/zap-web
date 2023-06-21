import React from 'react';
import MaskedInput from 'react-text-mask';

// const mask = createTextMask({
//     pattern: ['+', /[1-9]/, /\d/, /\d/, /\d/, ' ', '(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
//     guide: false
// });
const PhoneMask = () => {
    return (
        <MaskedInput
            // {...other}
            // ref={(ref) => {
            //     inputRef(ref ? ref.inputElement : null);
            // }}
            mask={['+', /[1-9]/, /\d/, /\d/, /\d/, ' ', '(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
};

export default PhoneMask;
