const AUTO_MONITOR_DISPLAY_DISABLE = true; //automated creation of rules voor displayIf and disableIf when explicit rules/validators are absent...

const V_CUSTOM_PREFIX = '__cv__';
const AND = "and";
const OR = "or";
const NOT = "not";

const RULE_GENERATOR = "RULE_GENERATOR";
const VISIBILITY = 'displayIf';
const SILENTVALIDITY = '$silentErrors'
const V_SILENTERRORS = '$silentErrors'
const V_VALID = '$invalid' // or $error NB: test for invalidity in vuelidate so we should invert it ...

const V_DISPLAYIF = 'displayIf'; ////sort of legacy, for rules that bring fn:Function() from the JSON, which we do not support ideally
const V_DISABLEIF = 'disableIf'; //sort of legacy, for rules that bring fn:Function() from the JSON, which we do not support ideally

const V_MINLENGTH = 'minLength'; //now it holds the name of the method to invoke on cHelpers for wrapped builtin vuelidate validators ...
const V_MAXLENGTH = 'maxLength';
const V_BETWEEN = 'between';
const V_REQUIRED = 'required';
const V_REQUIREDIF = 'requiredIf';
const V_REQUIREDUNLESS = 'requiredUnless';
const V_MINVALUE = 'minValue';
const V_MAXVALUE = 'maxValue';
const V_ALPHA = 'alpha';
const V_EMAIL = 'email';

const CFG_DISPLAY = 'hidden'; // indicates in fieldCfg the optional property 'hidden' decides the field display
const CFG_DISPLAY_INVERT = true; // indicates a display rule will have to negate the config prop

const CFG_DISABLE = 'disabled'; // indicates in fieldCfg the optional property 'disabled' decides the field disabling
const CFG_DISABLE_INVERT = false; // indicates a disable rule will NOT ave to negate the config prop

// terms to be used in the Configuration of validators (in the form definitions / fields definition) pointing to the supported retriever functions
const IS_VALID = "isValidSilent"
const SOME_VALID = "someValidSilent"
const ALL_VALID = "allValidSilent";

const IS_INVALID = "isInvalidSilent"
const SOME_INVALID = "someInvalidSilent";
const ALL_INVALID = "allInvalidSilent";

const IS_VALID_LAZY = "isValid"
const SOME_VALID_LAZY = "someValid"
const ALL_VALID_LAZY = "allValid";

const IS_INVALID_LAZY = "isInvalid"
const SOME_INVALID_LAZY = "someInvalid";
const ALL_INVALID_LAZY = "allInvalid";

const IS_VISIBLE = "isVisible";
const SOME_VISIBLE = "someVisible";
const ALL_VISIBLE = "allVisible";

const IS_HIDDEN = "isHidden";
const SOME_HIDDEN = "someHidden";
const ALL_HIDDEN = "allHidden";

const IS_DISABLED = "isDisabled";
const SOME_DISABLED = "someDisabled";
const ALL_DISABLED = "allDisabled";

const IS_ENABLED = "isEnabled";
const SOME_ENABLED = "someEnabled";
const ALL_ENABLED = "allEnabled";

// note: "empty" rules depend on the $model of the specified field. This assumes the two-way binding AND a dummy rule for a field when NO built in validator was specified at all. 
// We already use two of such dummy rules, namely for visibility and for enabling for each field, so $model should be present for each field.
const IS_EMPTY = "isEmpty";
const SOME_EMPTY = "someEmpty";
const ALL_EMPTY = "allEmpty";

const NOT_EMPTY = "notEmpty";
const SOME_NOT_EMPTY = "someNotEmpty";
const NONE_EMPTY = "noneEmpty";

// EXPERIMENT: helpers to retrieve the rule results of the built-in vuelidate requiredIf validator
const IS_REQUIRED_IF = "isRequiredIf"
const NOT_REQUIRED_IF = "notRequiredIf"

// TODO EXPERIMENT: helpers to retrieve the rule results of the built-in vuelidate minLength validator
const IS_MIN_LENGTH = "isMinLength";
const IS_MAX_LENGTH = "isMaxLength";

const V_SET_EXTERNAL_RESULTS = "setExternalResults"

const GET_INVALID_MESSAGE = "getInvalidMessage"
const GET_DISABLED_MESSAGE = "getDisabledMessage"

// Introduce constants for the custom validator names/types in order NOT to clash with built-in and other imported working vuelidate validators
const CV_TYPE_DISABLE_IF = `${V_CUSTOM_PREFIX}${V_DISABLEIF}`;
const CV_TYPE_DISPLAY_IF = `${V_CUSTOM_PREFIX}${V_DISPLAYIF}`;
const CV_TYPE_MIN_LENGTH = `${V_CUSTOM_PREFIX}${V_MINLENGTH}`;
const CV_TYPE_MAX_LENGTH = `${V_CUSTOM_PREFIX}${V_MAXLENGTH}`;
const CV_TYPE_BETWEEN = `${V_CUSTOM_PREFIX}${V_BETWEEN}`;
const CV_TYPE_SET_EXTERNAL_RESULTS = `${V_CUSTOM_PREFIX}${V_SET_EXTERNAL_RESULTS}`;
const CV_TYPE_REQUIRED = `${V_CUSTOM_PREFIX}${V_REQUIRED}`;
const CV_TYPE_REQUIREDIF = `${V_CUSTOM_PREFIX}${V_REQUIREDIF}`;
const CV_TYPE_REQUIREDUNLESS = `${V_CUSTOM_PREFIX}${V_REQUIREDUNLESS}`;
const CV_TYPE_MIN_VALUE = `${V_CUSTOM_PREFIX}${V_MINVALUE}`;
const CV_TYPE_MAX_VALUE = `${V_CUSTOM_PREFIX}${V_MAXVALUE}`;
const CV_TYPE_ALPHA = `${V_CUSTOM_PREFIX}${V_ALPHA}`;
const CV_TYPE_EMAIL = `${V_CUSTOM_PREFIX}${V_EMAIL}`;

/**
 * Helpers which merely retrieve optional presumed previous rule results. The require only the vm and an array of fieldname(s) as parameters.
 */
export const SUPPORTED_RETRIEVERS = [
    IS_VISIBLE, SOME_VISIBLE, ALL_VISIBLE,
    IS_HIDDEN, SOME_HIDDEN, ALL_HIDDEN,
    IS_VALID, SOME_VALID, ALL_VALID,
    IS_INVALID, SOME_INVALID, ALL_INVALID,
    IS_VALID_LAZY, SOME_VALID_LAZY, ALL_VALID_LAZY,
    IS_INVALID_LAZY, SOME_INVALID_LAZY, ALL_INVALID_LAZY,
    IS_DISABLED, SOME_DISABLED, ALL_DISABLED,
    IS_ENABLED, SOME_ENABLED, ALL_ENABLED,
    IS_EMPTY, SOME_EMPTY, ALL_EMPTY,
    NOT_EMPTY, SOME_NOT_EMPTY, NONE_EMPTY,
    // these search for the results for builtin vuelidate validators!!!! They do not -yet- rerun proper validators thmeselves.
    IS_REQUIRED_IF, NOT_REQUIRED_IF,
    IS_MIN_LENGTH,
    IS_MAX_LENGTH,
]

/**
 * Helpers which are able to execute an actual validator. These can take a proper rule execution configuration for dynamic parametrization AND dynamic targeting.
 */
export const SUPPORTED_EXECUTIONERS = [
    V_DISABLEIF,
    V_DISPLAYIF,
    V_SET_EXTERNAL_RESULTS,
    V_MINLENGTH,
    V_MAXLENGTH,
    V_BETWEEN,
    V_REQUIRED,
    V_REQUIREDIF,
    V_REQUIREDUNLESS,
    V_MINVALUE,
    V_MAXVALUE,
    V_ALPHA,
    V_EMAIL
]

export default {
    SUPPORTED_RETRIEVERS,
    SUPPORTED_EXECUTIONERS,
    CFG_DISPLAY,
    CFG_DISABLE,
    CFG_DISPLAY_INVERT,
    CFG_DISABLE_INVERT,
    V_CUSTOM_PREFIX,
    RULE_GENERATOR,
    VISIBILITY,
    SILENTVALIDITY,
    V_SILENTERRORS,
    V_VALID,
    V_DISPLAYIF,
    V_DISABLEIF,
    V_MINLENGTH,
    V_MAXLENGTH,
    V_BETWEEN,
    V_REQUIRED,
    V_REQUIREDIF,
    V_REQUIREDUNLESS,
    V_SET_EXTERNAL_RESULTS,
    V_MINVALUE,
    V_MAXVALUE,
    V_ALPHA,
    V_EMAIL,
    // custom validators that support dynamical parametrizations
    CV_TYPE_DISABLE_IF,
    CV_TYPE_DISPLAY_IF,
    CV_TYPE_MIN_LENGTH,
    CV_TYPE_MAX_LENGTH,
    CV_TYPE_BETWEEN,
    CV_TYPE_REQUIRED,
    CV_TYPE_REQUIREDIF,
    CV_TYPE_REQUIREDUNLESS,
    CV_TYPE_SET_EXTERNAL_RESULTS,
    CV_TYPE_MIN_VALUE,
    CV_TYPE_MAX_VALUE,
    CV_TYPE_ALPHA,
    CV_TYPE_EMAIL,
    // Helpers that merely "read" rule results, as opposed to "execute" other rules:
    IS_VISIBLE, SOME_VISIBLE, ALL_VISIBLE,
    IS_HIDDEN, SOME_HIDDEN, ALL_HIDDEN,
    IS_VALID, SOME_VALID, ALL_VALID,
    IS_INVALID, SOME_INVALID, ALL_INVALID,
    IS_VALID_LAZY, SOME_VALID_LAZY, ALL_VALID_LAZY,
    IS_INVALID_LAZY, SOME_INVALID_LAZY, ALL_INVALID_LAZY,
    IS_DISABLED, SOME_DISABLED, ALL_DISABLED,
    IS_ENABLED, SOME_ENABLED, ALL_ENABLED,
    AND,
    OR,
    NOT,
    IS_EMPTY, SOME_EMPTY, ALL_EMPTY,
    NOT_EMPTY, SOME_NOT_EMPTY, NONE_EMPTY,
    IS_REQUIRED_IF, NOT_REQUIRED_IF,
    // TODO ...
    IS_MIN_LENGTH, //SOME_MIN_LENGTH, ALL_MIN_LENGTH, NOT_MIN_LENGTH, SOME_NOT_MIN_LENGTH, NONE_MIN_LENGTH ???? terminology 
    IS_MAX_LENGTH,
    // IS_BETWEEN, etc
    GET_INVALID_MESSAGE,
    GET_DISABLED_MESSAGE,
    AUTO_MONITOR_DISPLAY_DISABLE,
};