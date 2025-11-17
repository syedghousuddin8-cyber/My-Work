<div class="card">
    <div class="card-body">
        <h5 class="mb-0">{{ translate('Meta Data Setup') }}</h5>
        <p class="text--secondary">{{ translate('Include meta title, description, and image to improve search engine visibility and social media sharing.') }}</p>
    </div>

    <div class="row px-4 mb-4  g-3">
        <div class="col-lg-6">
            <div class="card shadow--card-2">
                <div class="card-body">

                    <ul class="nav nav-tabs mb-4">
                        <li class="nav-item">
                            <a class="nav-link lang_link active" href="#"
                                id="default-link">{{ translate('Default') }}</a>
                        </li>
                        @foreach ($language as $lang)
                            <li class="nav-item">
                                <a class="nav-link lang_link" href="#"
                                    id="{{ $lang }}-link">{{ \App\CentralLogics\Helpers::get_language_name($lang) . '(' . strtoupper($lang) . ')' }}</a>
                            </li>
                        @endforeach
                    </ul>


                    <div class="lang_form" id="default-form">
                        <div class="form-group">
                            <label class="input-label" for="default_title">{{ translate('Meta_Title') }}
                                ({{ translate('messages.Default') }})<span class="form-label-secondary"
                                    data-toggle="tooltip" data-placement="right"
                                    data-original-title="{{ translate('This title appears in browser tabs, search results, and link previews.Use a short, clear, and keyword-focused title (recommended: 50–60 characters)') }}">
                                    <img src="{{ asset('public/assets/admin/img/info-circle.svg') }}" alt="">
                                </span>
                            </label>
                            <input type="text" name="meta_title[]" id="default_title" maxlength="60" class="form-control"
                                placeholder="{{ translate('Meta_Title') }}"
                                value="{{ isset($landingData['meta_title']) ? $landingData['meta_title']->getRawOriginal('value') : '' }}">
                        </div>
                        <input type="hidden" name="lang[]" value="default">
                        <div class="form-group mb-0">
                            <label class="input-label" for="exampleFormControlInput1">{{ translate('Meta_Description') }}
                                ({{ translate('messages.default') }})<span class="form-label-secondary"
                                    data-toggle="tooltip" data-placement="right"
                                    data-original-title="{{ translate('A brief summary that appears under your page title in search results.Keep it compelling and relevant (recommended: 120–160 characters)') }}">
                                    <img src="{{ asset('public/assets/admin/img/info-circle.svg') }}" alt="">
                                </span></label>
                            <textarea type="text" name="meta_description[]" maxlength="160" placeholder="{{ translate('Meta_Description') }}"
                                class="form-control min-h-90px ckeditor">{{ isset($landingData['meta_description']) ? $landingData['meta_description']->getRawOriginal('value') : '' }}</textarea>
                        </div>
                    </div>
                    @foreach ($language as $lang)
                        <?php
                        if (isset($landingData['meta_title']) && isset($landingData['meta_title']->translations) && count($landingData['meta_title']->translations)) {
                            $meta_title = [];
                            foreach ($landingData['meta_title']->translations as $t) {
                                if ($t->locale == $lang && $t->key == 'meta_title') {
                                    $meta_title[$lang]['value'] = $t->value;
                                }
                            }
                        }
                        if (isset($landingData['meta_description']) && isset($landingData['meta_description']->translations) && count($landingData['meta_description']->translations)) {
                            $meta_description = [];
                            foreach ($landingData['meta_description']->translations as $t) {
                                if ($t->locale == $lang && $t->key == 'meta_description') {
                                    $meta_description[$lang]['value'] = $t->value;
                                }
                            }
                        }
                        ?>
                        <div class="d-none lang_form" id="{{ $lang }}-form">
                            <div class="form-group">
                                <label class="input-label" for="{{ $lang }}_title">{{ translate('Meta_Title') }}
                                    ({{ strtoupper($lang) }})
                                    <span class="form-label-secondary" data-toggle="tooltip" data-placement="right"
                                        data-original-title="{{ translate('This title appears in browser tabs, search results, and link previews.Use a short, clear, and keyword-focused title (recommended: 50–60 characters)') }}">
                                        <img src="{{ asset('public/assets/admin/img/info-circle.svg') }}" alt="">
                                    </span>
                                </label>
                                <input type="text" name="meta_title[]" maxlength="60" id="{{ $lang }}_title"
                                    class="form-control" value="{{ $meta_title[$lang]['value'] ?? '' }}"
                                    placeholder="{{ translate('Meta_Title') }}">
                            </div>
                            <input type="hidden" name="lang[]" value="{{ $lang }}">
                            <div class="form-group mb-0">
                                <label class="input-label"
                                    for="exampleFormControlInput1">{{ translate('Meta_Description') }}
                                    ({{ strtoupper($lang) }})<span class="form-label-secondary" data-toggle="tooltip"
                                        data-placement="right"
                                        data-original-title="{{ translate('A brief summary that appears under your page title in search results.Keep it compelling and relevant (recommended: 120–160 characters)') }}">
                                        <img src="{{ asset('public/assets/admin/img/info-circle.svg') }}" alt="">
                                    </span></label>
                                <textarea type="text" name="meta_description[]" maxlength="160" placeholder="{{ translate('Meta_Description') }}"
                                    class="form-control min-h-90px ckeditor">{{ $meta_description[$lang]['value'] ?? '' }}</textarea>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card h-100">
                <div class="card-body d-flex flex-column justify-content-center">
                    <div>
                        <div class="d-flex justify-content-center">
                            <label class="text-dark d-block mb-4">
                                <strong>{{ translate('Meta Image') }}</strong>
                                <small class=""> {{ translate('( Ratio 2:1 )') }}</small>
                                <span class="form-label-secondary"
                                    data-toggle="tooltip" data-placement="right"
                                    data-original-title="{{ translate('This image is used as a preview thumbnail when the page link is shared on social media or messaging platforms.') }}">
                                    <img src="{{ asset('public/assets/admin/img/info-circle.svg') }}" alt="">
                                </span></label>
                            </label>
                        </div>
                        <div class="d-flex justify-content-center">
                            <label class="text-center position-relative">
                                <img class="img--110 min-height-170px min-width-170px onerror-image image--border"
                                    id="viewer" data-onerror-image="{{ asset('public/assets/admin/img/upload.png') }}"
                                    src="{{ \App\CentralLogics\Helpers::get_full_url('landing/meta_image', $landingData['meta_image']?->value ?? '', $landingData['meta_image']?->storage[0]?->value ?? 'public', 'upload_image') }}"
                                    alt="logo image" />
                                <div class="icon-file-group">
                                    <div class="icon-file">
                                        <i class="tio-edit"></i>
                                        <input type="file" name="image" id="customFileEg1" class="custom-file-input"
                                            accept=".webp, .jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*">
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div class="d-flex justify-content-center">
                            <div class="text-center">
                                <small>{{ translate('Upload a rectangular image (recommended size: 800×400 px, format: JPG or PNG)') }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {{-- <div class="col-12">
                    <div class="card shadow-none border-0 bg-soft-danger">
                        <div class="card-body d-flex">
                            <i class="mr-2 mt-3 text-danger tio-info-outined"></i>
                            <p class="fs-15 text-dark m-0">
                                <strong>{{ translate('Note:') }}</strong> {{ translate('Customize the section by adding a title, short description, and images in the') }} <a href="{{ route('admin.business-settings.zone.home') }}" target="_blank" class="text--underline text-006AE5">{{ translate('Zone Setup') }}</a> {{ translate('section. All created zones will be automatically displayed on the') }} <a href="{{route('home')}}" target="_blank" class="text-primary">{{ translate('Admin Landing') }}</a> {{ translate('Page. The zones will be based on the Zone Display Name.') }}
                            </p>
                        </div>
                    </div>
                </div> --}}
        <div class="col-12">
            <div class="btn--container justify-content-end">
                <button class="btn btn--reset " type="reset">{{ translate('reset') }}</button>
                <button class="btn btn--primary" type="submit">{{ translate('Save Information') }}</button>
            </div>
        </div>
    </div>
</div>
