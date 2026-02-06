'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { createAccount } from '@/entities/user';
import type { CreateAccountDto } from '@/entities/user/api/user';

interface SignupDialogProps {
    open: boolean;
    onClose: () => void;
}

export function SignupDialog({ open, onClose }: SignupDialogProps) {
    const [formData, setFormData] = useState<CreateAccountDto>({
        email: '',
        password: '',
        name: '',
        displayName: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await createAccount(formData);
            // TODO: 성공 처리 (모달 닫기, 로그인 페이지로 이동 등)
            onClose();
        } catch (error) {
            // TODO: 에러 처리
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange =
        (field: keyof CreateAccountDto) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev: CreateAccountDto) => ({
                ...prev,
                [field]: e.target.value,
            }));
        };

    return (
        <Dialog open={open} onOpenChange={() => onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>회원가입</DialogTitle>
                    <DialogDescription>
                        새 계정을 만들어 시작하세요.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        이메일
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleChange('email')}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        비밀번호
                    </label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={formData.password}
                        onChange={handleChange('password')}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                        이름
                    </label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={formData.name}
                        onChange={handleChange('name')}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="displayName"
                        className="text-sm font-medium"
                    >
                        표시 이름
                    </label>
                    <Input
                        id="displayName"
                        type="text"
                        placeholder="표시할 이름을 입력하세요"
                        value={formData.displayName}
                        onChange={handleChange('displayName')}
                        required
                    />
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onClose()}
                    >
                        취소
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? '처리 중...' : '회원가입'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
