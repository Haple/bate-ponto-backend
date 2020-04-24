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
    nomeDoMes(mes){        
        switch (mes) {
            case 1: return 'Jan';
            case 2: return 'Fev';
            case 3: return 'Mar';
            case 4: return 'Abr';
            case 5: return 'Mai';
            case 6: return 'Jun';
            case 7: return 'Jul';
            case 8: return 'Ago';
            case 9: return 'Set';
            case 10: return 'Out';
            case 11: return 'Nov';
            case 12: return 'Dez';
            default:
                return 'Inexistente';
        }
    }
}