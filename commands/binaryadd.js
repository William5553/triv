const xor = (a, b) => a === b ? 0 : 1;
  
const and = (a, b) => a == 1 && b == 1 ? 1 : 0;

const or = (a, b) => a || b;
  
const halfAdder = (a, b) => {
  const sum = xor(a, b);
  const carry = and(a, b);
  return [sum, carry];
};
  
const fullAdder = (a, b, carry) => {
  const halfAdd = halfAdder(a, b);
  const sum = xor(carry, halfAdd[0]);
  carry = and(carry, halfAdd[0]);
  carry = or(carry, halfAdd[1]);
  return [sum, carry];
};
  
const padZeroes = (a, b) => {
  const lengthDifference = a.length - b.length;
  if (lengthDifference !== 0) {
    const zeroes = Array.from(Array(Math.abs(lengthDifference)), () => String(0));
    if (lengthDifference > 0)
      // if a is longer than b then we pad b with zeroes
      b = `${zeroes.join('')}${b}`;
    else
      // if b is longer than a then we pad a with zeroes
      a = `${zeroes.join('')}${a}`;
  }
  return [a, b];
};
  
const addBinary = (a, b) => {
  let sum = '';
  let carry = '';
  
  const paddedInput = padZeroes(a, b);
  a = paddedInput[0];
  b = paddedInput[1];
  
  for (let i = a.length - 1; i >= 0; i--) {
    if (i == a.length - 1) {
      // half add the first pair
      const halfAdd1 = halfAdder(a[i], b[i]);
      sum = halfAdd1[0] + sum;
      carry = halfAdd1[1];
    } else {
      // full add the rest
      const fullAdd = fullAdder(a[i], b[i], carry);
      sum = fullAdd[0] + sum;
      carry = fullAdd[1];
    }
  }
  return carry ? carry + sum : sum;
};

exports.run = (client, message, args) => {
  if (args.length < 2) return message.reply(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  return message.reply(addBinary(args[0], args[1]));
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['badd', 'addbinary'],
  permLevel: 0,
  cooldown: 0
};
  
exports.help = {
  name: 'binaryadd',
  description: 'Adds binary numbers',
  usage: 'binaryadd [binary] [binary]',
  example: 'binaryadd 10011101 10110110'
};
