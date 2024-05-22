class ValidationUtil {
    static ONLY_LETTERS = /^[a-zA-Z]+$/;
    static LETTERS_NUMBERS = /^[a-zA-Z0-9_\.]+$/;

    static isEmpty(str) {
        return str === '' || str === ' ';
    }

    static validateOnlyLetter(str) {
        return ValidationUtil.isEmpty(str) || !ValidationUtil.ONLY_LETTERS.test(str);
    }

    static validateOnlyLetterAndNumbers(str) {
        return ValidationUtil.isEmpty(str) || !ValidationUtil.LETTERS_NUMBERS.test(str);
    }
}

export default ValidationUtil;