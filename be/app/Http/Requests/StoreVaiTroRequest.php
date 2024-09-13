<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator as ValidationValidator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;
use Illuminate\Foundation\Http\FormRequest;

class StoreVaiTroRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ten_vai_tro' => 'required|string|max:100|unique:vai_tros,ten_vai_tro',
            'mo_ta' => 'nullable|string',
            'ten_quyen' => 'array',
        ];
    }
    protected function failedValidation(ValidationValidator $validator)
    {
        $error = $validator->errors();

        $response = response()->json(
            [
                'error' => $error->messages()
            ],
            Response::HTTP_UNPROCESSABLE_ENTITY
        );
        throw new HttpResponseException($response);
    }
}
