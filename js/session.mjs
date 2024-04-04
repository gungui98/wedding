import { user } from './user.mjs';
import { theme } from './theme.mjs';
import { storage } from './storage.mjs';
import { comment } from './comment.mjs';
import { request, HTTP_POST } from './request.mjs';

export const session = (() => {

    const table = storage('session');
    const now = (new Date()).getTime() / 1000;

    comment.renderLoading();

    if (!table.has('token') || JSON.parse(atob(table.get('token')?.split('.')[1])).exp < now) {
        (new bootstrap.Modal('#loginModal')).show();
    } else {
        user.getUserDetail();
        user.getStatUser();
        comment.comment();
        theme.check();
    }

    const login = async (button) => {
        button.disabled = true;
        let tmp = button.innerHTML;
        button.innerHTML = '<div class="spinner-border spinner-border-sm me-1" role="status"></div>Loading..';

        const res = await request(HTTP_POST, '/api/session')
            .body({
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            })
            .then((res) => {
                if (res.code == 200) {
                    table.set('token', res.data.token);
                }

                return res.code === 200;
            });

        if (res) {
            bootstrap.Modal.getOrCreateInstance('#loginModal').hide();
            user.getUserDetail();
            user.getStatUser();
            comment.comment();
        }

        button.innerHTML = tmp;
        button.disabled = false;
    };

    const logout = () => {
        if (!confirm('Are you sure?')) {
            return;
        }

        table.unset('token');
        (new bootstrap.Modal('#loginModal')).show();
    };

    return {
        login,
        logout
    };
})();