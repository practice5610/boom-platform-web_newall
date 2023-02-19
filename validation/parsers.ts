import type { ErrorObject } from 'ajv';
import { appendErrors } from 'react-hook-form';

export const parseErrorSchema = <TFieldValues extends Record<string, any>>(
  validationError: Array<ErrorObject> | null | undefined,
  validateAllFieldCriteria: boolean
): Record<string, any> =>
  Array.isArray(validationError)
    ? validationError.reduce(
        //(previous: FieldErrors<TFieldValues>, { dataPath, keyword, message }) => {
        (previous, { dataPath, keyword, message }) => {
          const path = dataPath.replace(/^\./, '');
          return {
            ...previous,
            ...(path
              ? previous[path] && validateAllFieldCriteria
                ? {
                    [path]: appendErrors(
                      path,
                      validateAllFieldCriteria,
                      previous as Record<string, any>,
                      keyword,
                      message
                    ),
                  }
                : {
                    [path]: previous[path] || {
                      type: keyword,
                      message,
                      ...(validateAllFieldCriteria
                        ? {
                            types: { [keyword]: message || true },
                          }
                        : {}),
                    },
                  }
              : {}),
          };
        },
        {}
      )
    : {};
