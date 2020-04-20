const { parse, isAfter, differenceInMinutes } = require("date-fns");

module.exports = {
    horarioEstaDepois(inicial, final) {
        return isAfter(
            parse(final, 'HH:mm', new Date()),
            parse(inicial, 'HH:mm', new Date())
        );
    },
    diferencaDeHorario(final, inicial) {
        return differenceInMinutes(
            parse(final, 'HH:mm', new Date()),
            parse(inicial, 'HH:mm', new Date())
        );
    },
    mesAtual(){
        return new Date().getMonth() + 1;
    }
}