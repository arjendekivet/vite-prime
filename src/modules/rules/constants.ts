export const V_CUSTOM_PREFIX = '__cv__';
export const AND = "and";
export const OR = "or";
export const NOT = "not";

export const RULE_GENERATOR = "RULE_GENERATOR";
export const VISIBILITY = 'displayIf';
export const SILENTVALIDITY = '$silentErrors'
export const V_SILENTERRORS = '$silentErrors'
export const V_VALID = '$invalid' // or $error NB: test for invalidity in vuelidate so we should invert it ...

export const V_DISPLAYIF = 'displayIf'; ////sort of legacy, for rules that bring fn:Function() from the JSON, which we do not support ideally
export const V_DISABLEIF = 'disableIf'; //sort of legacy, for rules that bring fn:Function() from the JSON, which we do not support ideally

export const V_MINLENGTH = 'minLength'; //now it holds the name of the method to invoke on cHelpers for wrapped builtin vuelidate validators ...
export const V_MAXLENGTH = 'maxLength';
export const V_BETWEEN = 'between';
export const V_REQUIREDIF = 'requiredIf';
export const V_MINVALUE = 'minValue';
export const V_MAXVALUE = 'maxValue';

export const CFG_PROP_ENTITY_DISPLAY = 'hidden'; // indicates in fieldCfg the optional property 'hidden' decides the field display
export const CFG_PROP_ENTITY_DISPLAY_INVERT = true; // indicates a display rule will have to negate the config prop

export const CFG_PROP_ENTITY_DISABLE = 'disabled'; // indicates in fieldCfg the optional property 'disabled' decides the field disabling
export const CFG_PROP_ENTITY_DISABLE_INVERT = false; // indicates a disable rule will NOT ave to negate the config prop

// terms to be used in the Configuration of validators (in the form definitions / fields definition) pointing to the supported retriever functions
export const IS_VALID = "isValidSilent"
export const SOME_VALID = "someValidSilent"
export const ALL_VALID = "allValidSilent";

export const IS_INVALID = "isInvalidSilent"
export const SOME_INVALID = "someInvalidSilent";
export const ALL_INVALID = "allInvalidSilent";

export const IS_VALID_LAZY = "isValid"
export const SOME_VALID_LAZY = "someValid"
export const ALL_VALID_LAZY = "allValid";

export const IS_INVALID_LAZY = "isInvalid"
export const SOME_INVALID_LAZY = "someInvalid";
export const ALL_INVALID_LAZY = "allInvalid";

export const IS_VISIBLE = "isVisible";
export const SOME_VISIBLE = "someVisible";
export const ALL_VISIBLE = "allVisible";

export const IS_HIDDEN = "isHidden";
export const SOME_HIDDEN = "someHidden";
export const ALL_HIDDEN = "allHidden";

export const IS_DISABLED = "isDisabled";
export const SOME_DISABLED = "someDisabled";
export const ALL_DISABLED = "allDisabled";

export const IS_ENABLED = "isEnabled";
export const SOME_ENABLED = "someEnabled";
export const ALL_ENABLED = "allEnabled";

// note: "empty" rules depend on the $model of the specified field. This assumes the two-way binding AND a dummy rule for a field when NO built in validator was specified at all. 
// We already use two of such dummy rules, namely for visibility and for enabling for each field, so $model should be present for each field.
export const IS_EMPTY = "isEmpty";
export const SOME_EMPTY = "someEmpty";
export const ALL_EMPTY = "allEmpty";

export const NOT_EMPTY = "notEmpty";
export const SOME_NOT_EMPTY = "someNotEmpty";
export const NONE_EMPTY = "noneEmpty";

// EXPERIMENT: helpers to retrieve the rule results of the built-in vuelidate requiredIf validator
export const IS_REQUIRED_IF = "isRequiredIf"
export const NOT_REQUIRED_IF = "notRequiredIf"

// TODO EXPERIMENT: helpers to retrieve the rule results of the built-in vuelidate minLength validator
export const IS_MIN_LENGTH = "isMinLength";
export const IS_MAX_LENGTH = "isMaxLength";

export const V_SET_EXTERNAL_RESULTS = "setExternalResults"

export const GET_INVALID_MESSAGE = "getInvalidMessage"
export const GET_DISABLED_MESSAGE = "getDisabledMessage"

// Introduce constants for the custom validator names/types in order NOT to clash with built-in and other imported working vuelidate validators
export const CV_TYPE_DISABLE_IF = `${V_CUSTOM_PREFIX}${V_DISABLEIF}`;
export const CV_TYPE_DISPLAY_IF = `${V_CUSTOM_PREFIX}${V_DISPLAYIF}`;
export const CV_TYPE_MIN_LENGTH = `${V_CUSTOM_PREFIX}${V_MINLENGTH}`;
export const CV_TYPE_MAX_LENGTH = `${V_CUSTOM_PREFIX}${V_MAXLENGTH}`;
export const CV_TYPE_BETWEEN = `${V_CUSTOM_PREFIX}${V_BETWEEN}`;
export const CV_TYPE_SET_EXTERNAL_RESULTS = `${V_CUSTOM_PREFIX}${V_SET_EXTERNAL_RESULTS}`;
export const CV_TYPE_REQUIREDIF = `${V_CUSTOM_PREFIX}${V_REQUIREDIF}`;
export const CV_TYPE_MIN_VALUE = `${V_CUSTOM_PREFIX}${V_MINVALUE}`;
export const CV_TYPE_MAX_VALUE = `${V_CUSTOM_PREFIX}${V_MAXVALUE}`;

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
    V_MINLENGTH,
    V_MAXLENGTH,
    V_BETWEEN,
    V_REQUIREDIF,
    V_SET_EXTERNAL_RESULTS,
    V_MINVALUE,
    V_MAXVALUE
]

export default {
    SUPPORTED_RETRIEVERS,
    SUPPORTED_EXECUTIONERS,
    CFG_PROP_ENTITY_DISPLAY,
    CFG_PROP_ENTITY_DISABLE,
    CFG_PROP_ENTITY_DISPLAY_INVERT,
    CFG_PROP_ENTITY_DISABLE_INVERT,
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
    V_REQUIREDIF,
    V_SET_EXTERNAL_RESULTS,
    V_MINVALUE,
    V_MAXVALUE,
    // custom validators that support dynamical parametrizations
    CV_TYPE_DISABLE_IF,
    CV_TYPE_DISPLAY_IF,
    CV_TYPE_MIN_LENGTH,
    CV_TYPE_MAX_LENGTH,
    CV_TYPE_BETWEEN,
    CV_TYPE_REQUIREDIF,
    CV_TYPE_SET_EXTERNAL_RESULTS,
    CV_TYPE_MIN_VALUE,
    CV_TYPE_MAX_VALUE,
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
};