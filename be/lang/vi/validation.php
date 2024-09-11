<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'Trường :thuộc tính phải được chấp nhận.',
    'accepted_if' => 'Trường :thuộc tính phải được chấp nhận khi :other là :value.',
    'active_url' => 'Trường :attribute phải là URL hợp lệ.',
    'after' => 'Trường :attribute phải là ngày sau :date.',
    'after_or_equal' => 'Trường :attribute phải là ngày sau hoặc bằng :date.',
    'alpha' => 'Trường :attribute chỉ được chứa các chữ cái.',
    'alpha_dash' => 'Trường :attribute chỉ được chứa các chữ cái, số, dấu gạch ngang và dấu gạch dưới.',
    'alpha_num' => 'Trường :attribute chỉ được chứa chữ cái và số.',
    'array' => 'Trường :attribute phải là một mảng.',
    'ascii' => 'Trường :attribute chỉ được chứa các ký tự và ký hiệu chữ và số 1 byte.',
    'before' => 'Trường :attribute phải là ngày trước :date.',
    'before_or_equal' => 'Trường :attribute phải là ngày trước hoặc bằng :date.',
    'between' => [
        'array' => 'Trường :attribute phải có giữa các mục :min và :max.',
        'file' => 'Trường :attribute phải nằm trong khoảng :min và :max kilobyte.',
        'numeric' => 'Trường :attribute phải nằm trong khoảng :min và :max.',
        'string' => 'Trường :attribute phải nằm trong khoảng :ký tự tối thiểu và :max.',
    ],
    'boolean' => 'Trường :attribute phải đúng hoặc sai.',
    'can' => 'Trường :attribute chứa giá trị trái phép.',
    'confirmed' => 'Xác nhận trường :attribute không khớp.',
    'current_password' => 'Mật khẩu không đúng.',
    'date' => 'Trường :attribute phải là ngày hợp lệ.',
    'date_equals' => 'Trường :attribute phải là ngày bằng :date.',
    'date_format' => 'Trường :attribute phải khớp với định dạng :format.',
    'decimal' => 'Trường :thuộc tính phải có :decimal thập phân.',
    'decinated' => 'Trường :attribute phải bị từ chối.',
    'decline_if' => 'Trường :attribute phải bị từ chối khi :other là :value.',
    'different' => 'Trường :attribute và :other phải khác nhau.',
    'digits' => 'Trường :attribute phải là :digits signatures.',
    'digits_between' => 'Trường :attribute phải nằm trong khoảng :các chữ số tối thiểu và :tối đa.',
    'dimensions' => 'Trường :attribute có kích thước hình ảnh không hợp lệ.',
    'distinct' => 'Trường :attribute có giá trị trùng lặp.',
    'doesnt_end_with' => 'Trường :attribute không được kết thúc bằng một trong các trường sau: :values.',
    'doesnt_start_with' => 'Trường :attribute không được bắt đầu bằng một trong các trường sau: :values.',
    'email' => 'Trường :attribute phải là địa chỉ email hợp lệ.',
    'ends_with' => 'Trường :attribute phải kết thúc bằng một trong các giá trị sau: :values.',
    'enum' => 'Thuộc tính được chọn không hợp lệ.',
    'exists' => 'Thuộc tính đã chọn không hợp lệ.',
    'extensions' => 'Trường :attribute phải có một trong các phần mở rộng sau: :values.',
    'file' => 'Trường :attribute phải là một tập tin.',
    'filled' => 'Trường :attribute phải có giá trị.',
    'gt' => [
        'array' => 'Trường :attribute phải có nhiều hơn :value items.',
        'file' => 'Trường :attribute phải lớn hơn :value kilobyte.',
        'numeric' => 'Trường :attribute phải lớn hơn :value.',
        'string' => 'Trường :attribute phải lớn hơn :value ký tự.',
    ],
    'gte' => [
        'array' => 'Trường :attribute phải có các mục :value trở lên.',
        'file' => 'Trường :attribute phải lớn hơn hoặc bằng :value kilobyte.',
        'numeric' => 'Trường :attribute phải lớn hơn hoặc bằng :value.',
        'string' => 'Trường :attribute phải lớn hơn hoặc bằng :value ký tự.',
    ],
    'hex_color' => 'Trường :attribute phải có màu thập lục phân hợp lệ.',
    'image' => 'Trường :attribute phải là hình ảnh.',
    'in' => 'Thuộc tính được chọn không hợp lệ.',
    'in_array' => 'Trường :attribute phải tồn tại trong :other.',
    'integer' => 'Trường :attribute phải là số nguyên.',
    'ip' => 'Trường :attribute phải là địa chỉ IP hợp lệ.',
    'ipv4' => 'Trường :attribute phải là địa chỉ IPv4 hợp lệ.',
    'ipv6' => 'Trường :attribute phải là địa chỉ IPv6 hợp lệ.',
    'json' => 'Trường :attribute phải là chuỗi JSON hợp lệ.',
    'lowercase' => 'Trường :attribute phải là chữ thường.',
    'lt' => [
        'array' => 'Trường :attribute phải có ít hơn :value items.',
        'file' => 'Trường :attribute phải nhỏ hơn :value kilobyte.',
        'numeric' => 'Trường :attribute phải nhỏ hơn :value.',
        'string' => 'Trường :attribute phải nhỏ hơn :value ký tự.',
    ],
    'lte' => [
        'array' => 'Trường :attribute không được có nhiều hơn :value items.',
        'file' => 'Trường :attribute phải nhỏ hơn hoặc bằng :value kilobyte.',
        'numeric' => 'Trường :attribute phải nhỏ hơn hoặc bằng :value.',
        'string' => 'Trường :attribute phải nhỏ hơn hoặc bằng :value ký tự.',
    ],
    'mac_address' => 'Trường :attribute phải là địa chỉ MAC hợp lệ.',
    'max' => [
        'array' => 'Trường :attribute không được có nhiều hơn :max items.',
        'file' => 'Trường :attribute không được lớn hơn :max kilobyte.',
        'numeric' => 'Trường :attribute không được lớn hơn :max.',
        'string' => 'Trường :attribute không được lớn hơn :max ký tự.',
    ],
    'max_digits' => 'Trường :attribute không được có nhiều hơn :max chữ số.',
    'mimes' => 'Trường :attribute phải là một tập tin thuộc loại: :values.',
    'mimetypes' => 'Trường :attribute phải là một tập tin thuộc loại: :values.',
    'min' => [
        'array' => 'Trường :attribute phải có ít nhất :min items.',
        'file' => 'Trường :attribute phải có ít nhất :min kilobyte.',
        'numeric' => 'Trường :attribute ít nhất phải có :min.',
        'string' => 'Trường :attribute phải có ít nhất :min ký tự.',
    ],
    'min_digits' => 'Trường :attribute phải có ít nhất :min signatures.',
    'missing' => 'Trường :attribute phải bị thiếu.',
    'missing_if' => 'Trường :attribute phải bị thiếu khi :other là :value.',
    'missing_unless' => 'Trường :attribute phải bị thiếu trừ khi :other là :value.',
    'missing_with' => 'Trường :attribute phải bị thiếu khi :values ​​có mặt.',
    'missing_with_all' => 'Trường :attribute phải bị thiếu khi :values ​​có mặt.',
    'multiple_of' => 'Trường :attribute phải là bội số của :value.',
    'not_in' => 'Thuộc tính được chọn không hợp lệ.',
    'not_regex' => 'Định dạng trường :attribute không hợp lệ.',
    'numeric' => 'Trường :attribute phải là số.',
    'password' => [
        'letters' => 'Trường :attribute phải chứa ít nhất một chữ cái.',
        'mixed' => 'Trường :attribute phải chứa ít nhất một chữ hoa và một chữ cái viết thường.',
        'numbers' => 'Trường :attribute phải chứa ít nhất một số.',
        'symbols' => 'Trường :attribute phải chứa ít nhất một ký hiệu.',
        'uncompromised' => 'Thuộc tính đã cho đã xuất hiện trong một vụ rò rỉ dữ liệu. Vui lòng chọn một :thuộc tính khác.',
    ],
    'present' => 'Trường :attribute phải có.',
    'present_if' => 'Trường :attribute phải có khi :other là :value.',
    'present_unless' => 'Trường :attribute phải có trừ khi :other là :value.',
    'present_with' => 'Trường :attribute phải có mặt khi :values ​​có mặt.',
    'present_with_all' => 'Trường :attribute phải có mặt khi :values ​​có mặt.',
    'prohibited' => 'Trường :attribute bị cấm.',
    'prohibited_if' => 'Trường :attribute bị cấm khi :other là :value.',
    'prohibited_unless' => 'Trường :attribute bị cấm trừ khi :other nằm trong :values.',
    'prohibits' => 'Trường :attribute cấm :other hiện diện.',
    'regex' => 'Định dạng trường :attribute không hợp lệ.',
    'required' => 'Trường :attribute là bắt buộc.',
    'required_array_keys' => 'Trường :attribute phải chứa các mục nhập cho: :values.',
    'required_if' => 'Trường :attribute là bắt buộc khi :other là :value.',
    'required_if_accepted' => 'Trường :attribute là bắt buộc khi :other được chấp nhận.',
    'required_unless' => 'Trường :attribute là bắt buộc trừ khi :other nằm trong :values.',
    'required_with' => 'Trường :attribute là bắt buộc khi có :values.',
    'required_with_all' => 'Trường :attribute là bắt buộc khi có :values.',
    'required_without' => 'Trường :attribute là bắt buộc khi :values ​​không có mặt.',
    'required_without_all' => 'Trường :attribute là bắt buộc khi không có :giá trị nào hiện diện.',
    'same' => 'Trường :attribute phải khớp :other.',
    'size' => [
        'array' => 'Trường :attribute phải chứa :size items.',
        'file' => 'Trường :attribute phải là :size kilobyte.',
        'numeric' => 'Trường :attribute phải là :size.',
        'string' => 'Trường :attribute phải là :size ký tự.',
    ],
    'starts_with' => 'Trường :attribute phải bắt đầu bằng một trong các trường sau: :values.',
    'string' => 'Trường :attribute phải là một chuỗi.',
    'timezone' => 'Trường :attribute phải là múi giờ hợp lệ.',
    'unique' => 'Thuộc tính :attribute đã được sử dụng.',
    'uploaded' => 'Không thể tải lên :thuộc tính.',
    'uppercase' => 'Trường :attribute phải viết hoa.',
    'url' => 'Trường :attribute phải là URL hợp lệ.',
    'ulid' => 'Trường :attribute phải là ULID hợp lệ.',
    'uuid' => 'Trường :attribute phải là UUID hợp lệ.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
